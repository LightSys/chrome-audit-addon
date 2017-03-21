/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*/

// change onInstalled to onStartup when we're ready to go live
// onInstalled is for testing purposes since we don't want to keep opening and closing chrome.
chrome.runtime.onInstalled.addListener(function() {
  // This gets all Chrome extensions and apps
  chrome.management.getAll(function(items) {
    // Loop through each extension and addon.
    for (var i = 0; i < items.length; i++) {

      // for each item
      var item = items[i];
      // check if it is an extension
        if(item.type == "extension"){
          // if yes, check it agains the whitelist
            // if !whitelisted, set unsafe
          //alert("THIS IS AN EXTENSION " + item.id + " : (" + item.type + ") " + item.name);
        }
        // else do nothing because we only care about extensions
     }
  });
  //alert("hello install");
});
