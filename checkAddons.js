/*
* checkAddons.js is an Event Page that runs in the background.
* I think all the calls are asynchronous.
*
*/

// change onInstalled to onStartup when we're ready to go live
// onInstalled is for testing purposes since we don't want to keep opening and closing chrome.
chrome.runtime.onInstalled.addListener(function() {
  alert("hello startup");
});
