/*
* (Thomas, this file can access any variable or method in eventPage.js.)
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

// Before sending the headers, check audit, append appropriate x-audit header.
chrome.webRequest.onBeforeSendHeaders.addListener( function(details) {
  // Get the current URL.
  getCurrentUrl(function(currentUrl) {
    if(currentUrl !== null && currentUrl !== undefined) {
      // Check if the current page is secure.
      var protocol = currentUrl.substring(0, 5); //this was the only way I could get the protocol
      console.log("Protocol: " + protocol);
      if(protocol == "https") {
        console.log("secure current url: " + currentUrl);
        //check if audit passed
        if(passAudit) {
          console.log("Audit passed")
        } else {
          console.log("audit didn't pass");
        }
      } else {
        console.log("url is insecure");
      }
    }
  });

},
{urls: ["<all_urls>"]},
["blocking"]
);

function getCurrentUrl(done) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    // Apparently you can do a callback from a nested function - sweet!
      done(tabs[0].url);
  });
}
