'use strict';

var fileContainers = document.getElementsByClassName('file');
var fileHeaders = document.getElementsByClassName('file-header');

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
    fileContainers[i].style.top = '0px';
    var currentFileHeader = fileContainers[i].getElementsByClassName('file-header')[0];
    var headerHeight = currentFileHeader.getBoundingClientRect().height;
    fileContainers[i].style.paddingTop = headerHeight + 'px';
  }
};

var getCurrentFileContainerIndex = function() {
  var maxBerofeZero = -1000000;
  var maxBerofeZeroIndex = -1;
  for(var i=0; i<fileContainers.length; i++) {
    var currentTop = fileContainers[i].getBoundingClientRect().top;
    if (currentTop > maxBerofeZero && currentTop < 0) {
      maxBerofeZero = currentTop;
      maxBerofeZeroIndex = i;
    }
  }
  return maxBerofeZeroIndex;
};

var makeCurrentHeaderSticky = function() {
  var maxBerofeZeroIndex = getCurrentFileContainerIndex();
  if (maxBerofeZeroIndex === -1) {
    // reset the first one if we scrolled back
    setHeaderTop(document.getElementsByClassName('file-header')[0], 0);
    return;
  }

  var currentfileContent = fileContainers[maxBerofeZeroIndex];
  var currentFileHeader = currentfileContent.getElementsByClassName('file-header')[0];
  var headerHeight = currentFileHeader.getBoundingClientRect().height;
  var newHeaderTop = (currentfileContent.getBoundingClientRect().top * -1) -1;

  if (newHeaderTop < 0) {
    // We reached the top of the file scrolling up
    return;
  }
  if (newHeaderTop + headerHeight > currentfileContent.getBoundingClientRect().height) {
    // We reached the bottom of the file scrolling down
    setHeaderTop(currentFileHeader, currentfileContent.getBoundingClientRect().height - headerHeight + 'px');
    return;
  }

  setHeaderTop(currentFileHeader, newHeaderTop);
  
  resetHeadersFrom(maxBerofeZeroIndex + 1);
};

var init = function() {
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
    if (request.type === 'init') {
      init();
    }
  }
);