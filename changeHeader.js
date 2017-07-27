/*DOCUMENTATION
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
* This file will use crypto.js, salt hashing via PRNG, hashing using SHA256, HMAC, and hex strings.
*
*changeHeader Steps:
* 1. Split the config file into two different segments:
    -Secured Urls
    -All other configurations
  2. Hash the rest of the config using SHA256.
  3. Determine what message the plugin is trying to send, rather it be "passed" or "failed."
  4. Generate a salt for concatenating with the message for the HMAC. 
  5. Create the HMAC as HMAC-SHA256. Variable from step #1 will be the key.
  6. Convert "salt" and "HMAC" into hex strings.
  7. Assemble the header using everything needed from above. From this, "x-Audit" will be created which needs to be equal to "message" "salt64+HMAC192". The 64 and 192 will be the bits of the hex string attached.
*
* This x-Audit will be compared to the the server, and if the browser passes the audit, allowing the user to access the websites hosted by the server.
*/


// var SHA256 = CryptoJS.SHA256("Message");
// console.log("Message: " + SHA256);

var parsedJson = null; // variable to store the config json file

// get the json file and store it in the parsedJson global
getConfigUrl(function(configUrl){
  console.log("Result: " + configUrl);
  $.get(configUrl, function(json) {
    parsedJson = JSON.parse(json);
  });
});

// Before sending the headers, check audit, append appropriate x-audit header.
chrome.webRequest.onBeforeSendHeaders.addListener( function(details) {
  // if there is a json file
  if(parsedJson !== null) {
    // Get the current URL.
    getCurrentUrl(function(currentUrl) {
      if(currentUrl !== null) {
        var isOnList = false; // initialize and declare bool to check if the url is on the list or not
        // compare it to each item in the list
        for(obj in parsedJson.urlList) {
          // if there is a match, set the bool to true
            if(parsedJson.urlList[obj].url == currentUrl) {
              isOnList = true;
            }
        }

        // if the url was on the list
        if(isOnList){
          // run audits again to see if things have changed
          getAndCheckConfig(supressAlert = true);
          //check if audit passed
          if(passAudit) {
            console.log("Audit passed");
          } else {
            console.log("audit didn't pass");
            // disableSite(currentUrl); //kinda works. Slow and not always accurate.
          }
        }
      }
    });
  }
},
//Do this for all URLs, and make it blocking (not asynchronous)
{urls: ["<all_urls>"]},
["blocking"]
);

// This function is supposed to block a secure site if the audit fails.
// It kinda works, but it's slow, and only blocks sites on a refresh.
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) { 
//     return {cancel: details.url.indexOf("://facebook.com/") != -1};
//   },
//  {urls: ["<all_urls"]},
//  ["blocking"]);

//
// }

/**
* Gets the URL of the current tab
* @Return the URL of the current tab, once it's been determined.
*/
function getCurrentUrl(done) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    if(tabs[0].url != undefined){
      // Apparently you can do a callback from a nested function - sweet!
      done(tabs[0].url);
    }
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {return {cancel: true}; },
    {urls: [getCurrentUrl(currentUrl)]},
    ["blocking"]);