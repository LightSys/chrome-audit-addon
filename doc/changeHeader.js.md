## About `changeHeader.js`

This file adds and extra HTTP header to requests when visiting secure websites, with the information of whether or not the browser passed the security audit. 

#### Detailed Description (for developers)

When visiting a website, it checks if it is specified in [the configuration file](writing_config.md), and if it is, sends an X-Audit header. 

Upon a web request, the script determines the requested URL (using the `getCurrentUrl()` function). If the URL is one specified in [the configuration file](writing_config.md), then the outcome of the audit is sent as a header. 

[Return to the README.md file](../README.md)
