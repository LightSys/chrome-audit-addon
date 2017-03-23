## About `eventpage.js`

This file is an Event Page, which runs code asynchronously in the background at installation and during startup. On installation, the add-on queries for a configuration file URL, and checks to see if installed extensions are whitelisted.

#### Detailed Description (for developers)

On installation, the script prompts the user for a configuration URL (the example configuration is the default value for the prompt). 

_Prompting the user for a configuration URL._  
![Prompting the user for a configuration URL](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/eventpage.js_img/eventpage.js_img00.png)

The file, which is formatted as JSON, downloaded with JQuery, and parsed. The script uses the `chrome.management` API to get a list of installed extensions (`function getInstalledExtensions(done)` in the source). The ID's of the whitelisted extensions, parsed from the configuration file, are stored in a list. Finally, the list of installed extensions is compared with the whitelist using `function compareExtensions(whitelistIds, installedExtensions, done)` (which returns a list of bad add-ons), and an alert dialog with the names of the non-whitelisted add-ons is displayed. 

_Alerting the user of non-approved extensions_  
![Alerting the user of non-approved extensions](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/eventpage.js_img/eventpage.js_img01.png)

[Click here to browse the source code for this file](../eventPage.js). 
