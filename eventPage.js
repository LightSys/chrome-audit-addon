/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*/

//Global variable for the config URL
var configUrl = null;

chrome.runtime.onInstalled.addListener(function() {
  configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/41da5412adb3eecff0da82a948b799c4661e20c8/files/testconfig.json");
  getConfigFile(); // this not only gets the config file, it calls functions that check the installed addons agains the whitelist

  // get the config file
  function getConfigFile() {
    if(configUrl != null) {
      // Get the json file from the configUrl and parse it.
      $.get(configUrl, function(json) {
        var parsedJson = JSON.parse(json);

        // this gets all the installed extensions. They are sent as a callback.
        getInstalledExtensions(function(installedExtensions) {

          //create array to store IDs in
          var whitelistIds = new Array();
          
          // get each json object, store its ID in the array.
          for (var obj in parsedJson.whitelist) {
            whitelistIds.push(parsedJson.whitelist[obj].id);
          }

          // loop through extensions, compare with whitelist
          installedExtensions.forEach(function(extension) {
            if(whitelistIds.indexOf(extension.id) > -1) {
              alert(extension.name + " is in whitelist.");
            } else {
              alert(extension.name + " is not in whitelist.");
            }
          });
        });
      });
    }
  }

  // this function gets each installed extension and sends the list back to the caller
  function getInstalledExtenstions(done) {
    // This gets all Chrome extensions and apps
    chrome.management.getAll(function(items){
      var installedExtensions = new Array();
      items.forEach(function(item){
        item.type == "extension" ? installedExtensions.push(item) : null;
      });
      //send the installed extensions to the caller
      done(installedExtensions);
    });
  }

});
// this function gets the whitelist
// it is a callback function so that when it is called, it gets the whitelist before moving on.
function getConfigFile() {

  if(configUrl != null) {
    var parsedJson = null;
    // Get the json file from the configUrl and parse it.
    $.get(configUrl, function(json) {
      parsedJson = JSON.parse(json);
      return parsedJson;
      //alert(parsedJson.whitelist);
    });
  }
}


// change onInstalled to onStartup when we're ready to go live
// onInstalled is for testing purposes since we don't want to keep opening and closing chrome.
// chrome.runtime.onStartup.addListener(function() {
//
//   // This gets all Chrome extensions and apps
//   // checkConfigFile will not run if the URL is null, so we can guarentee we won't be getting garbage results the first time.
//   checkConfigFile(function(){
//     chrome.management.getAll(function(items) {
//
//       // Loop through each extension and addon.
//       for (var i = 0; i < items.length; i++) {
//         // for each item
//         var item = items[i];
//         // check if it is an extension
//         if(item.type == "extension"){
//           // if yes, check it agains the whitelist
//           // if !whitelisted, set unsafe
//           alert("THIS IS AN EXTENSION " + item.id + " : (" + item.type + ") " + item.name);
//         }
//         // else do nothing because we only care about extensions
//       }
//     });
//   });
//
//   //alert("hello install");
// });
