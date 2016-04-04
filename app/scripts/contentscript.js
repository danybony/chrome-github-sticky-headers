'use strict';

var initialized = false;
var prToolbarHeight;
var fileContainers = document.getElementsByClassName('file');
var fileHeaders = document.getElementsByClassName('file-header');

var getPrToolbarHeight = function() {
  var toolbars = document.getElementsByClassName('pr-toolbar');
  var height = 0;
  for (var i = 0; i < toolbars.length; i++) {
    height = Math.max(height, toolbars[1].getBoundingClientRect().height);
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
    document.onscroll = makeCurrentHeaderSticky;
  } else {
    // remove onscroll listener if no file is present in the current page
    document.onscroll = null;
  }
};

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.type === 'init' && !initialized) {
      initialized = true;
      init();
    }
  }
);
