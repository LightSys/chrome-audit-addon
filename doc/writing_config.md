# Writing the configuration file

### The Extension Whitelist

_Example:_
```json
{
  "whitelist": [
    {"name": "Chrome Audit Addon", "id": "bajpgljgpgcaihgkmgebfpngcnompgdp"},
    {"name": "UBlock Origin", "id": "cjpalhdlnbpafiamejdnhcphjbkeiagm"},
    {"name": "Web Developer", "id": "bfbameneiokkgbdmiekhjnmfkcnldhhm"},
    {"name": "Plus for Trello", "id": "gjjpophepkbhejnglcmkdnncmaanojkf"}
  ]
}
```

This section of the configuration file sets the allowed extensions, and their unique Chrome Web Store ID's. 

These unique ID's are hidden by default, but can be displayed if the "Developer mode" box on the chrome://extensions page is ticked. Below are step-by-step directions on adding an extension to the whitelist.

1. In Chrome, install the extension you wish to whitelist. _(For the purposes of this demonstration, we will be showing how to whitelist the Privacy Badger extension.)_  
![In Chrome, install the extension you wish to whitelist.](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/writing_config_img/whitelist_img00.png)

2. Go to the [chrome://extensions](chrome://extensions) page, and tick the "Developer mode" checkbox near the top of the page.  
![Tick the "Developer mode" checkbox near the top of the page.](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/writing_config_img/whitelist_img01.png)

3. In your custom configuration file, add a line to the whitelist, containing the name and ID of the extension you wish to whitelist.  
![Add a line to your configuration file's whitelist](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/doc/writing_config_img/whitelist_img02.png)

