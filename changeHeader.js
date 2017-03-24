/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* ChangeHeader Requirements:
*
* 1. Making a decision based on the above of whether the browser passes or fails the security audit.
*
* 2. When the browser goes to a URL, the hostname is compared (via salted hashing) with a list of hashes for "secured areas".
*  If a hash matches, and the browser is "failing" the audit, the request is blocked with an error page that lists the reasons for the failure.
*
* 3. When the browser goes to a secured URL, an extra HTTP header, "X-Audit: passed f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
*  (with a sha-256 hash* of the audit add-on's configuration) is included, so the site being accessed can assess whether or not to continue
*  allowing the connection and sign-in.
*
*/

// var SHA256 = CryptoJS.SHA256("Message");
// console.log("Message: " + SHA256);

var parsedJson = null;

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

// This kinda works, but it's slow, and only blocks sites on a refresh

// function disableSite(currentUrl){
//   chrome.webRequest.onBeforeRequest.addListener(
//          function(details) { return {cancel: true}; },
//          {urls: [currentUrl]},
//          ["blocking"]);
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
