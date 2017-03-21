/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*/

//Global variable for the config URL
var configUrl = null;

chrome.runtime.onInstalled.addListener(function() {
  configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json");

  // This gets all Chrome extensions and apps
  checkConfigFile(function(){
    chrome.management.getAll(function(items) {

      // Loop through each extension and addon.
      for (var i = 0; i < items.length; i++) {
        // for each item
        var item = items[i];
        // check if it is an extension
        if(item.type == "extension"){
          // if yes, check it agains the whitelist
          // if !whitelisted, set unsafe
          alert("THIS IS AN EXTENSION " + item.id + " : (" + item.type + ") " + item.name);
        }
        // else do nothing because we only care about extensions
      }
    });
  });
});

// change onInstalled to onStartup when we're ready to go live
// onInstalled is for testing purposes since we don't want to keep opening and closing chrome.
chrome.runtime.onStartup.addListener(function() {

  // This gets all Chrome extensions and apps
  // checkConfigFile will not run if the URL is null, so we can guarentee we won't be getting garbage results the first time.
  checkConfigFile(function(){
    chrome.management.getAll(function(items) {

      // Loop through each extension and addon.
      for (var i = 0; i < items.length; i++) {
        // for each item
        var item = items[i];
        // check if it is an extension
        if(item.type == "extension"){
          // if yes, check it agains the whitelist
          // if !whitelisted, set unsafe
          alert("THIS IS AN EXTENSION " + item.id + " : (" + item.type + ") " + item.name);
        }
        // else do nothing because we only care about extensions
      }
    });
  });

  //alert("hello install");
});

// this function gets the whitelist
// it is a callback function so that when it is called, it gets the whitelist before moving on.
function checkConfigFile(callback) {
  if(configUrl != null) {
    // Get the json file from the configUrl and parse it.
    $.get(configUrl, function(json) {
      var parsedJson = JSON.parse(json);
      alert(parsedJson.whitelist);
    });
  }

  callback();
}
