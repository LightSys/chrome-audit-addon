## About `changeHeader.js`

This file adds and extra HTTP header to requests when visiting secure websites, with the information of whether or not the browser passed the security audit. 

#### Detailed Description (for developers)

Upon a web request, the script determines the requested URL (using the `getCurrentUrl()` function). If the URL is a HTTPS protocol, then the outcome of the audit is logged to the console. 

[Return to the README.md file](../README.md)
