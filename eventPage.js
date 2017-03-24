/*
 * @file
 * eventPage.js runs scripts on installation and startup that check the audit status of the browser.
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
//Global variable for the audit passing status
var defaultUrl = "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json"
var passAudit = null;
var supressAlert = false;

// Run this on installation
chrome.runtime.onInstalled.addListener(function() {
  supressAlert = false;
  getAndCheckConfig();
});

// Run this on Chrome startup
chrome.runtime.onStartup.addListener(function() {
  supressAlert = false;
  getAndCheckConfig();
});

// Run a check when an extensino is enabled
chrome.management.onEnabled.addListener(function() {
  supressAlert = true;
  getAndCheckConfig();
});

// Run a check when an extension is disabled
chrome.management.onDisabled.addListener(function() {
  supressAlert = true;
  getAndCheckConfig();
});



/**
 * Downloads the latest config file, and runs the audit on the browser.
 */
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
          chrome.browserAction.setIcon({
            path: "icon/fail-icon48x48.png"
          });
          if(!supressAlert){
            alert("These addons are not in the whitelist: \n"
              + badAddons.join("\n")
              + "\n\nPlease uninstall or disable these addons and restart Chrome before continuing.");
          }
          passAudit = false;
        } else {
          chrome.browserAction.setIcon({
            path: "icon/icon48x48.png"
          });
          passAudit = true;
        }
      });
    });
  });
}

/**
 * Compares two lists of extensions: a whitelist, and those currently
 * installed and enabled. Returns those that are installed and enabled
 * but not whitelisted.
 * @Param {Array} whitelistIds, the ID's of the extensions that are whitelisted
 * @Param {Array} installedExtensions, the extensions installed and enabled.
 * @Return {Array} done, when finished, returns a list of extensions installed and enabled but not whitelisted.
 */
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

/**
 * Gets a list of currently installed and enabled extensions.
 * @Return done, when finished, returns a list of enabled extensions.
 */
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

/**
 * Stores the add-on options to Chrome's persistent storage.
 * @Param theConfigUrl, the web address of the configuration file.
 */
function set_options(configUrl){
  chrome.storage.sync.set({"ConfigUrl": configUrl}, function(){
    console.log("Wrote url successfully (url: " + configUrl + ")");
  });
}

function getAndCheckConfig() {
    get_options(function(configUrl) {
    if(configUrl == null){
      configUrl = prompt("Please enter the URL of the config file: ", defaultUrl);
      set_options(configUrl);
    }
    checkConfigFile(configUrl);
  });
}

/**
 * Gets the add-on options from Chrome's persistent storage.
 * @Return done, the configuration file URL
 */
function get_options(done){
  chrome.storage.sync.get("ConfigUrl", function(items) {
    done(items.ConfigUrl);
  });
}
