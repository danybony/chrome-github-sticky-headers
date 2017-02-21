'use strict';

var prToolbarHeight;
var fileContainers = document.getElementsByClassName('file');
var fileHeaders = document.getElementsByClassName('file-header');
var toggleButtons = [];
var collapseText = 'Collapse';
var expandText = 'Expand';

var getPrToolbarHeight = function() {
  var toolbars = document.getElementsByClassName('pr-toolbar');
  var height = 0;
  for (var i = 0; i < toolbars.length; i++) {
    height = Math.max(height, toolbars[i].getBoundingClientRect().height);
  }
  return height;
};

var setHeaderTop = function(fileHeader, topPosition) {
  fileHeader.style.top = topPosition + 'px';
};

var resetHeadersFrom = function(firstIndex) {
  for (var i = firstIndex; i < fileHeaders.length; i++) {
    setHeaderTop(fileHeaders[i], 0);
  }
};

var resetAllHeaders = function() {
  for (var i = 0; i < fileHeaders.length; i++) {
    fileHeaders[i].style.top = '0px';
    fileHeaders[i].style.position = 'absolute';
    fileHeaders[i].style.width = '100%';
    fileHeaders[i].style.zIndex = 1;
  }
};

var setFileContainersPadding = function() {
  for (var i = 0; i < fileContainers.length; i++) {
    var headerHeight = fileHeaders[i].getBoundingClientRect().height;
    fileContainers[i].style.paddingTop = headerHeight + 'px';
  }
};

var setExpandedButton = function(button) {
  button.setAttribute('aria-label', 'Collapse diff file');
  button.innerHTML = collapseText;
};

var setCollapsedButton = function(button) {
  button.setAttribute('aria-label', 'Expand diff file');
  button.innerHTML = expandText;
};

var getDiffBox = function(fileContainer) {
  return fileContainer.getElementsByClassName('rich-diff')[0] ||
    fileContainer.getElementsByClassName('data highlight blob-wrapper')[0] ||
    fileContainer.getElementsByClassName('render-container')[0] ||
    fileContainer.getElementsByClassName('data')[0];
};

var collapseFileContainer = function(fileContainer) {
  var box = getDiffBox(fileContainer);
  if (box) {
    box.style.display = 'none';
    setCollapsedButton(fileContainer.getElementsByClassName('collapse-expand-btn')[0]);
  }
};

var expandFileContainer = function(fileContainer) {
  var box = getDiffBox(fileContainer);
  if (box) {
    box.style.display = 'inherit';
    setExpandedButton(fileContainer.getElementsByClassName('collapse-expand-btn')[0]);
  }
};

var toggleCollapseExpand = function(button, fileContainer) {
  return function() {
    if (button.innerHTML === collapseText) {
      collapseFileContainer(fileContainer);
    } else if (button.innerHTML === expandText) {
      expandFileContainer(fileContainer);
    }
  };
};

var addCollapseExpandButtons = function() {
  for (var i = 0; i < fileContainers.length; i++) {
    var btn = document.createElement('A');
    btn.setAttribute('class', 'btn btn-sm tooltipped tooltipped-nw collapse-expand-btn');
    fileContainers[i].getElementsByClassName('file-actions')[0].appendChild(btn);
    setExpandedButton(btn);
    btn.addEventListener('click', toggleCollapseExpand(btn, fileContainers[i]));
    toggleButtons.push(btn);
  }
};

var expandAll = function() {
  for (var i = 0; i < fileContainers.length; i++) {
    expandFileContainer(fileContainers[i]);
  }
};

var collapseAll = function() {
  for (var i = 0; i < fileContainers.length; i++) {
    collapseFileContainer(fileContainers[i]);
  }
};

var buildCollapseExpandDiv = function(text, fn) {
  var div = document.createElement('DIV');
  div.setAttribute('class', 'diffbar-item');
  var button = document.createElement('BUTTON');
  button.setAttribute('class', 'btn-link muted-link');
  button.innerHTML = text + ' all';
  button.addEventListener('click', fn);
  div.appendChild(button);
  return div;
};

var addCollapseExpandAllButtons = function() {
  var right = document.getElementsByClassName('diffbar')[0].getElementsByClassName('float-right');
  right = right[right.length - 1];

  right.appendChild(buildCollapseExpandDiv(collapseText, collapseAll));
  right.appendChild(buildCollapseExpandDiv(expandText, expandAll));
};

var getCurrentFileContainerIndex = function() {
  var maxBerofeZero = -1000000;
  var maxBerofeZeroIndex = -1;
  for(var i=0; i<fileContainers.length; i++) {
    var currentTop = fileContainers[i].getBoundingClientRect().top;
    if (currentTop > maxBerofeZero && currentTop < prToolbarHeight) {
      maxBerofeZero = currentTop;
      maxBerofeZeroIndex = i;
    }
  }
  return maxBerofeZeroIndex;
};

var makeCurrentHeaderSticky = function() {
  var maxBerofeZeroIndex = getCurrentFileContainerIndex();
  if (maxBerofeZeroIndex === -1) {
    // reset the headers if we scroll back before the first one
    resetAllHeaders();
    return;
  }

  var currentfileContent = fileContainers[maxBerofeZeroIndex];
  var currentFileHeader = fileHeaders[maxBerofeZeroIndex];
  var headerHeight = currentFileHeader.getBoundingClientRect().height;
  var newHeaderTop = (currentfileContent.getBoundingClientRect().top * -1) -1;

  if (newHeaderTop < prToolbarHeight * -1) {
    // We reached the top of the file scrolling up
    return;
  }
  if (newHeaderTop + headerHeight + prToolbarHeight > currentfileContent.getBoundingClientRect().height) {
    // We reached the bottom of the file scrolling down
    setHeaderTop(currentFileHeader, currentfileContent.getBoundingClientRect().height - headerHeight + 'px');
    return;
  }

  setHeaderTop(currentFileHeader, newHeaderTop + prToolbarHeight);
  
  resetHeadersFrom(maxBerofeZeroIndex + 1);
};

var init = function() {
  prToolbarHeight = getPrToolbarHeight();
  if (fileContainers.length !== 0) {
    resetAllHeaders();
    setFileContainersPadding();
    addCollapseExpandButtons();
    addCollapseExpandAllButtons();
    document.onscroll = makeCurrentHeaderSticky;
  } else {
    // remove onscroll listener if no file is present in the current page
    document.onscroll = null;
  }
};

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.type === 'init') {
      var diffbar = document.getElementsByClassName('diffbar');
      if (diffbar.length === 1 && !/sticky-init/g.test(diffbar[0].className)) {
        diffbar[0].className += ' sticky-init';
        init();
      }
    }
  }
);
