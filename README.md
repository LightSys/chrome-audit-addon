# Security Audit Add-on for Chrome

### Introduction

Many organizations struggle with security risks created by users installing risky add-ons to browsers. This is especially true in bring-your-own-device environments or work-from-home environments. This project is a Chrome browser add-on to audit the browser's security. 

Languages: JavaScript, JSON, JQuery, HTML, and CSS.

### Detailed Description

The goal of this project would be to create a Chrome add-on which verifies that the browser's security configuration is acceptable and only allows sign-in to secured areas if the configuration meets requirements. Missions organizations are often exposed far more than other organizations to browser security lapses, since missionaries often use their own personally-owned laptops and devices, and often from outside of a carefully controlled office network. These lapses in security can cause a loss of confidential information as well as expose field missionaries to "association/correlation" issues which can result in additional scrutiny from governments and activist groups.

### Administrating for the Audit Add-on

Administrators asking users to use the add-on with their websites should provide their users with a custom configuration file's URL. We've hosted [an example file](https://raw.githubusercontent.com/LightSys/chrome-audit-addon/master/files/testconfig.json), but recommend that administrators edit this to fulfill their needs. See the [testconfig.json documentation](https://github.com/LightSys/chrome-audit-addon/tree/master/doc/files/testconfig.json.md) for details on how to write a custom configuration file.

_Note: The url for the configuration file should not exceed 1,000 characters. If it does, the add-on may not function correctly._

---

## Documentation

Documentation for specific files can be found in the `doc` directory. Below are links to the documentation for each of the files.

**Chrome-Audit-Addon**
-- [css/popup.css](https://github.com/LightSys/chrome-audit-addon/tree/master/doc/css/popup.css.md)  
-- [files/testconfig.json](https://github.com/LightSys/chrome-audit-addon/tree/master/doc/files/testconfig.json.md)  
-- [libraries/jquery-3.2.0.min.js](https://github.com/LightSys/chrome-audit-addon/blob/master/doc/libraries/jquery-3.2.0.min.js.md)  
-- [eventpage.js](https://github.com/LightSys/chrome-audit-addon/blob/master/doc/eventpage.js.md)  
-- [manifest.json](https://github.com/LightSys/chrome-audit-addon/blob/master/doc/manifest.json.md)  
-- [popup.html](https://github.com/LightSys/chrome-audit-addon/blob/master/doc/popup.html.md)  
-- [popup.js](https://github.com/LightSys/chrome-audit-addon/blob/master/doc/popup.js.md)  

---

## Add-on Development

### Add-on Procedure 
This plugin would have several aspects to it:

0. On installation, asking the user for a URL to load a configuration file from.
1. Scanning the browser's configuration to determine if any risky configuration options are set.
2. Scanning the browser's extensions/add-ons list, and comparing that with a configurable whitelist.
3. Determining how long it has been since the browser was updated.
4. Making a decision based on the above of whether the browser passes or fails the security audit.
5. When the browser goes to a URL, the hostname is compared (via salted hashing) with a list of hashes for
"secured areas". If a hash matches, and the browser is "failing" the audit, the request is blocked with an error page
that lists the reasons for the failure.
6. When the browser goes to a secured URL, an extra HTTP header, "X-Audit: passed
f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2" (with a sha-256 hash* of the audit
add-on's configuration) is included, so the site being accessed can assess whether or not to continue allowing the
connection and sign-in.
7. When the user tries to install an add-on/extensions that's not on the whitelist, or tries to make non-compliant
configuration changes, the user is (configurably) blocked or warned that the change or add-on's presence will
prevent access to some important websites.
8. When the user goes to a secured URL that is specifically marked for update-checking, the add-on will automatically check for a configuration update at a specific pathname, and import the update if it exists.

## Notes On Development and Phasing

Generating the configuration hash is tricky. This must only include options for this add-on, not other options for the browser and not options that are being monitored by this add-on. The salted hashes should not be included, but everything else should, in a way that results in a consistent result regardless of the *order* of the configuration options. This will likely require sorting in advance of hashing.

The add-on's configuration will be stored in the browser's configuration options list. However, the configuration file (aspects 0 and 8) will contain options that will then be imported into the browser's configuration. If the configuration file contains secured URL locations, those will be passed through a salted hash before being imported.

This add-on won't provide perfect security. Someone could write a malicious add-on that impersonates this one, and the web server could never know. The user's machine may also have security issues outside of the browser itself. But this add-on should provide a significant improvement in security for the target audience of bring-your-own-device users, and ordinary anti-malware software could enforce other computer/device security options.

Phasing: We don't expect this add-on to be 100% complete during Code-a-Thon. However, a start would allow this to be a proof of concept, and would also allow participants and the review team to examine any pre-existing software that could serve this function and/or serve as a (if open source) starting point for this add-on. Even completion of the first phase would help get this project off the ground.

Phase One: Aspects 1 through 4 above (configuration hardcoded at this phase).

Phase Two: Aspect 5 and 6.

Phase Three: Aspect 7.

Phase Four: Aspects 0 and 8.

Phase Five: UI to edit/build the add-on configuration file.

Deliverables would include complete source code to the add-on, documentation, and ensuring LightSys has sufficient copyright rights to the code so that LightSys can continue to use and develop the project.

