# Security Audit add-on for Firefox or Chrome

Many organizations struggle with security risks created by users installing risky add-ons to browsers. This is
especially true in bring-your-own-device environments or work-from-home environments. This project is a
browser add-on to audit the browser's security.
Languages/Tools: JavaScript, with some XML, JSON, HTML, and CSS.
Security Classification: SEC2 - Missions Only

## Introduction

The goal of this project would be to create a Firefox or Chrome add-on which verifies that the browser's security
configuration is acceptable and only allows sign-in to secured areas if the configuration meets requirements.
Missions organizations are often exposed far more than other organizations to browser security lapses, since
missionaries often use their own personally-owned laptops and devices, and often from outside of a carefully
controlled office network. These lapses in security can cause a loss of confidential information as well as expose
field missionaries to "association/correlation" issues which can result in additional scrutiny from governments and
activist groups.
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
8. When the user goes to a secured URL that is specifically marked for update-checking, the add-on will
automatically check for a configuration update at a specific pathname, and import the update if it exists.
Generating the configuration hash is tricky. This must only include options for this add-on, not other options
for the browser and not options that are being monitored by this add-on. The salted hashes should not be
included, but everything else
should, in a way that results in a consistent result regardless of the *order* of the configuration options. This will
likely require sorting in advance of hashing.
Your edit was saved. ×
The add-on's configuration will be stored in the browser's configuration options list. However, the configuration
file (aspects 0 and 8) will contain options that will then be imported into the browser's configuration. If the
configuration file contains secured URL locations, those will be passed through a salted hash before being
imported.
This add-on won't provide perfect security. Someone could write a malicious add-on that impersonates this one,
and the web server could never know. The user's machine may also have security issues outside of the browser
itself. But this add-on should provide a significant improvement in security for the target audience of bring-yourown-device
users, and ordinary anti-malware software could enforce other computer/device security options.
Phasing: We don't expect this add-on to be 100% complete during Code-a-Thon. However, a start would allow this
to be a proof of concept, and would also allow participants and the review team to examine any pre-existing
software that could serve this function and/or serve as a (if open source) starting point for this add-on. Even
completion of the first phase would help get this project off the ground.
Phase One: Aspects 1 through 4 above (configuration hardcoded at this phase).
Phase Two: Aspect 5 and 6.
Phase Three: Aspect 7.
Phase Four: Aspects 0 and 8.
Phase Five: UI to edit/build the add-on configuration file.
Deliverables would include complete source code to the add-on, documentation, and ensuring LightSys has
sufficient copyright rights to the code so that LightSys can continue to use and develop the project.

Design Discussion (by design reviewers)
GregBeeley 02/05: Pulling a bit of design wisdom out of Tom's comments in the scoring section below: The XAudit
header should always be sent, with a passed/failed indication in the header (instead of only sending it when
"passed"). The hex string value in the X-Audit header should consist of 64 bits of salt, plus the first 192 bits of the
sha-256 hash, and the salt should be included in the hashing of the configuration file (i.e., HMAC-SHA256 should
be used, with the configuration file as the key to the hash and the salt as the message content -- that may seem
backwards as the config is much larger than the salt, but it is exactly what HMAC is designed to do; we're using
the "secret" config, shared by browser and server, as the key to authenticate the salt, which is probably better called
a nonce rather than a salt).
For performance, the browser and server can pre-hash the configuration and use that hash as the key to HMAC
(HMAC internally hashes the key anyhow when the key is longer than the hash's blocksize). That saves a bit of
CPU time in not having to re-hash the entire config every time a request is issued and validated.
If the server chooses to, it can maintain a list of used salts and reject X-Audit headers re-using an already-used salt.
We could consider a counter here or a s/key or RKE style OTP system for generating salt (so the server could
prevent replay without maintaining a huge list), but that would require the browser to maintain state (and to do so
for each secured URL), something that would have to be carefully considered based on what happens when the
user re-installs the browser or logs in using a second device. I say this is a second go-around consideration.
GregBeeley 02/07: As I've thought about this some more, I think the counter idea is a good one, and the counter
and failed/passed should be included with the salt in the "message" for the HMAC computation. However, the
counter is a "phase two" thing here. If participants are really ambitious and want to know more about this option,
we can discuss it after project selection.
Recommendation Level (0=worst, 10=best) and Thoughts
TimYoung 02/02 Rank 10 -- This is an awesome idea. Many security things foist a policy on someone. This is set
up so the organization can build their own policy and be able to enforce it. I suspect that after a number of
ICCMers use it, there might be some additions / changes. But it looks very configurable from a quick glance. Since
Your edit was saved. ×
Greg already has knowledge about building plugins, I think a lot of the technological road-blocks have already
been figured out. It is a great, multi-organization project. If we make it, be sure it gets presented for TFM at the
next ICCM!
Tom Francis 02/02/2017. 9. My biggest concern is if the usefulness of the add-on will outlive its ability to do its
job. Chrome, e.g. has been restricting what add-ons can do about other add-ons; I expect it won't be long before
add-ons cannot enumerate other add-ons. I would suggest the X-Audit header _always_ be sent to the "secured"
URLs, not just when everything is OK. That should prevent another add-on from masquerading as this one (so
long as this one is actually installed), since the server would receive the header twice, once indicating failure (from
this add-on), and once indicating success (from the fake). The server could then choose to just deny access. I'd also
recommend a random salt that is prefixed to the value, and truncate the hash (so someone would have to inspect
the add-on to determine it's not just a hash). That's a good deal more work for the server, but it allows future
expansion of using different configurations for different servers, and forces any masquerading to be done at the
browser level, and not by a man-in-the-middle, since the MiTM couldn't have access to the actual configuration. A
simplified version of the add-on which doesn't have "secured" URLs and doesn't send the special header could also
be generically useful, as I haven't found any generic add-on blacklists outside of some AV programs (which have
been heavily criticized for blocking the good stuff and letting the malware go unchecked).
GregBeeley 02/03/2017: Good thoughts, Tom, on the salt and on always emitting the X-Audit header. I had
assumed the browser would not emit the same header twice, but I did not test that. :) Verifying the salt/hash
shouldn't be a compute problem for the server (I wasn't considering an iterative hash here to try to further conceal
the config; that would be quite expensive to apply to every request).
DanDennison 02/05 Rank 10 I think this is a great idea. I too have similar concerns about the longer-term
usefulness of this, but it is a start. I think it should be an Extension so that it can change its icon to indicate all is
not well and cite the reason for it when clicked on. Strongly suggest recommending to the users to store client certs
in TPMs or Yubikeys. The phased development idea also warms the heart. I would package this for deployment
with many things left for the enterprise to customize, e.g. the secured URL list, the name of the special header, (if
possible in Chrome) the desired header order to use when hitting secured sites, and (most importantly) the ability
to pin certificates for the configuration server and for the secured sites!!
