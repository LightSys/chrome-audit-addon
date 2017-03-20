/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*/

// change onInstalled to onStartup when we're ready to go live
// onInstalled is for testing purposes since we don't want to keep opening and closing chrome.
chrome.runtime.onInstalled.addListener(function() {
  chrome.management.getAll(function(items) {
    for (var i = 0; i < items.length; i++) {
       var item = items[i];
       alert(item.id + " : (" + item.type + ") " + item.name);
     }

  });
  alert("hello startup");
});
