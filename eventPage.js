/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*
* Requirements:
*
* 0. On installation, asking the user for a URL to load a configuration file from: done.
*
* 1. Scanning the browser's configuration to determine if any risky configuration options are set: this cannot be done
* in an addon, because Chrome does not allow it. This needs to be done with GPO or by another program which sets flags from the
* command line before launching Chrome. Or, the master_preferences file can be set BEFORE Chrome launches for the FIRST TIME.
*
* 2. Scanning the browser's extensions/add-ons list, and comparing that with a configurable whitelist: done.
*
* 3. Determining how long it has been since the browser was updated: we are able to read current version, but not the latest.
*
*/

//Global variable for the config URL
var configUrl = null;
var passAudit = null;

chrome.runtime.onInstalled.addListener(function() {
  //configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json");
  //checkConfigFile(); // this not only gets the config file, it calls functions that check the installed addons agains the whitelist
});

chrome.runtime.onStartup.addListener(function() {
  checkConfigFile();
});


// get the config file
function checkConfigFile() {
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

        // compare the extensions, and get a list of bad addons back
        compareExtensions(whitelistIds, installedExtensions, function(badAddons) {
          //if there are bad addons, say so
          if(badAddons.length > 0) {
            alert("These addons are not in the whitelist: " + badAddons.join(", ") + ".\n\nPlease uninstall or disable these addons and restart Chrome before continuing.");
            passAudit = false;
          }
        });
      });
    });
  }
}

function compareExtensions(whitelistIds, installedExtensions, done) {
  var badAddons = new Array();
  // loop through extensions, compare with whitelist
  installedExtensions.forEach(function(extension) {
    if(whitelistIds.indexOf(extension.id) < 0) {
      badAddons.push(extension.name);
    }
  });
  done(badAddons)
}

// this function gets each installed extension and sends the list back to the caller
function getInstalledExtensions(done) {
  // This gets all Chrome extensions and apps
  chrome.management.getAll(function(items){
    var installedExtensions = new Array();
    items.forEach(function(item){
      // If the item is an extension and it is enabled, add it to the list, else do nothing.
      item.type == "extension" && item.enabled == true ? installedExtensions.push(item) : null;
    });
    //send the installed extensions to the caller
    done(installedExtensions);
  });
}
