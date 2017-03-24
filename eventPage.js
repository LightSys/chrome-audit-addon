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
var passAudit = null;

chrome.runtime.onInstalled.addListener(function() {
  get_options(function(configUrl) {
    if(configUrl == null){
      configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json");
      set_options(configUrl);
    }
    // this not only gets the config file from the configUrl, it calls functions that check the
    //installed addons agains the whitelist
    checkConfigFile(configUrl);
    });
});

chrome.runtime.onStartup.addListener(function() {
  get_options(function(configUrl) {
    if(configUrl == null){
      configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json");
      set_options(configUrl);
    }
    checkConfigFile(configUrl);
  });
});


// get the config file
function checkConfigFile(configUrl) {
  if(configUrl == null) {
    return;
  }
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
          alert("These addons are not in the whitelist: \n"
            + badAddons.join("\n")
            + ".\n\nPlease uninstall or disable these addons and restart Chrome before continuing.");
          passAudit = false;
        } else {
          passAudit = true;
        }
      });
    });
  });
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

// set_options stores a configuration url using chrome's storage API
// theConfigUrl: the url to be stored
function set_options(configUrl){
  chrome.storage.sync.set({"ConfigUrl": configUrl}, function(){
    console.log("Wrote url successfully (url: " + configUrl + ")");
  });
}

// get_options accesses chrome's storage API
// done: function to access items.ConfigUrl
function get_options(done){
  chrome.storage.sync.get("ConfigUrl", function(items) {
    done(items.ConfigUrl);
  });
}
