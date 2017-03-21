## About `eventpage.js`

This file is an Event Page, which runs code asynchronously in the background at installation and during startup. On installation, the add-on queries for a configuration file URL, and checks to see if installed extensions are whitelisted.

#### Detailed Description (for developers)

On installation, the script prompts the user for a configuration URL (the example configuration is the default value for the prompt). The file, which is formatted as JSON, downloaded with JQuery, and parsed. The script uses the `chrome.management` API to get a list of installed extensions (`function getInstalledExtensions(done)` in the source). The ID's of the whitelisted extensions, parsed from the configuration file, are stored in an array. Finally, the list of installed extensions is compared with the whitelist, and alert dialogs are presented to the user to report if the extension is in the whitelist or not. 

[Click here to browse the source code for this file](../eventPage.js). 
