## About `checkAddons.js`

The `checkAddons.js` javascript file interacts with the chrome APIs to detect what extensions are installed and gain information about them.

#### Procedure of the `checkAddons.js` script

0. User installs the addon.
1. Using the `chrome.management` API, the script gets all the currently installed extensions and apps.
2. For each of the returned items, check if it is an extension. If it is, create an alert dialog displaying information about the extension. 
3. Finally, there is a "hello install" alert, which is to demonstrate the asynchronous nature of the script. This typically displays before any of the alerts created in step 2. 

_**Note:** the dialogs created by this script have been disabled, at least for the time being._
