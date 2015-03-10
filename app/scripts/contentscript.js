'use strict';

document.onscroll = function() {
    var fileContainers = document.getElementsByClassName('file');
    var maxBerofeZero = -1000000;
    var maxBerofeZeroIndex = -1;
    for(var i=0; i<fileContainers.length; i++) {
      var currentTop = fileContainers[i].getBoundingClientRect().top;
      if (currentTop > maxBerofeZero && currentTop < 0) {
        maxBerofeZero = currentTop;
        maxBerofeZeroIndex = i;
      }
    }
    if (maxBerofeZeroIndex === -1) {
      document.getElementsByClassName('file-header')[0].style.top = '0px';
      return;
    }
    var currentfileContent = fileContainers[maxBerofeZeroIndex];
    var currentFileHeader = currentfileContent.getElementsByClassName('file-header')[0];
    var headerHeight = currentFileHeader.getBoundingClientRect().height;
    currentfileContent.style.paddingTop = headerHeight + 'px';
    var newHeaderTop = (currentfileContent.getBoundingClientRect().top * -1 - 1);
    if (newHeaderTop < 0) {
      // We reached the top of the file scrolling up
      return;
    }
    if (newHeaderTop + headerHeight > currentfileContent.getBoundingClientRect().height) {
      // We reached the bottom of the file scrolling down
      currentFileHeader.style.top = currentfileContent.getBoundingClientRect().height - headerHeight + 'px';
      return;
    }
    currentFileHeader.style.top = newHeaderTop + 'px';
    currentFileHeader.style.position = 'absolute';
    currentFileHeader.style.width = '100%';
    currentFileHeader.style.zIndex = 2;

    var fileHeaders = document.getElementsByClassName('file-header');
    for (i = maxBerofeZeroIndex + 1; i < fileHeaders.length; i++) {
      fileHeaders[i].style.top = '0px';
    }
  };
