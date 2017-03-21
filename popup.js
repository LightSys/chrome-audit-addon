//Popup.js

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = handleStateChange;
xhr.open("GET", chrome.extension.getURL('http'))
