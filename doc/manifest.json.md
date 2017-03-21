## About `manifest.json`

The `manifest.json` file is a file that the Chrome browser reads to obtain important information about the add-on. Below is a line-by-line explanation of what exactly this file does.

>   "manifest_version": 2,
>   "name": "Chrome Audit Addon",
>   "version": "1.0",
>   "description": "Audits browser addons and settings",

These fields are basic information about the add-on. The only one that may seem a little confusing is the `manifest_version` field, which describes the format of this file.

>   "icons": { "16": "icon/icon16x16.png",
>              "48": "icon/icon48x48.png",
>             "128": "icon/icon128x128.png" }, 

This sets the different icons for Chrome to use with the extension. The `"16"` and `"48"` icons are simply scaled version of the full icon. The `"128"` icon is in fact a 96 by 96 pixel icon, with a padding of 16 pixels of transparency on each side, as is recommended. _(Note: The `"128"` icon is only used during installation and in the Chrome Web Store)._

>   "browser_action": {
>     "default_popup": "popup.html",
>     "default_title": "Addon Auditor"
>   },

The `"browser_action"` field places an icon for the add-on in the Chrome toolbar. The `"default_popup"` field specifies an html file to be displayed when the icon is clicked, and the `"default_title"` field contains the text displayed when the mouse is hovered over the icon. 

There is also the option to add a `"default_icon"` field, but if it is left unspecified, it uses the closest size from the icons specified above, scales it (if it isn't already the exact same size), and then displays it. 

>   "background": {
>     "scripts": ["checkAddons.js"],
>     "persistent": false
>   },


