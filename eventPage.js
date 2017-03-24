/*
* checkAddons.js is an Event Page that runs in the background.
* All the calls are asynchronous.
*
*/

//Global variable for the config URL
var configUrl = null;

chrome.runtime.onInstalled.addListener(function() {
  get_options(function(theConfigUrl) {
    configUrl = theConfigUrl;
    if(configUrl == null){
      configUrl = prompt("Please enter the URL of the config file: ", "https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json");
      set_options(configUrl);
    }
    checkConfigFile(); // this not only gets the config file, it calls functions that check the installed addons agains the whitelist
  });
});

chrome.runtime.onStartup.addListener(function() {
  get_options(function(theConfigUrl) {
    configUrl = theConfigUrl;
    checkConfigFile();
  });
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
            alert("These addons are not in the whitelist: " + badAddons);
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
      item.type == "extension" ? installedExtensions.push(item) : null;
    });
    //send the installed extensions to the caller
    done(installedExtensions);
  });
}

// set_options stores a configuration url using chrome's storage API
// theConfigUrl: the url to be stored
function set_options(theConfigUrl){
  chrome.storage.sync.set({"ConfigUrl": theConfigUrl}, function(){
    console.log("Wrote url successfully (url: " + theConfigUrl + ")");
  });
}

// get_options accesses chrome's storage API
// done: function to access items.ConfigUrl
function get_options(done){
  chrome.storage.sync.get("ConfigUrl", function(items) {
    done(items.ConfigUrl);
  });
}
