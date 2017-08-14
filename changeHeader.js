/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* ChangeHeader Requirements:
*
* 1. Making a decision based on the above of whether the browser passes or fails the security audit: it checks a variable set in
* the other background page.
*
* 2. When the browser goes to a URL, the hostname is compared (via salted hashing) with a list of hashes for "secured areas".
*  If a hash matches, and the browser is "failing" the audit, the request is blocked with an error page that lists the reasons for
*  the failure: no idea how to do this. I imported CryptoJS, so whoever does this next should have a head start. The first couple
*  lines of comments should give an idea of how to do a sha256 hash.
*
* 3. When the browser goes to a secured URL, an extra HTTP header, "X-Audit: passed f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
*  (with a sha-256 hash* of the audit add-on's configuration) is included, so the site being accessed can assess whether or not to continue
*  allowing the connection and sign-in: didn't get to this.
*
*/


// get the json file and store it in the StringifiedConfig global
getConfigUrl(function(configUrl){
  console.log("Result: " + configUrl);
  /*$.get(configUrl, function(json) {
	var parsed = JSON.parse(json);
	var stringifiedConfig = JSON.stringify(parsed.whitelist);
	console.log("StringifiedConfig: " + stringifiedConfig);
  });*/
  $.ajax({url: configUrl, cache: false})
  .done(function(json) {
    var parsed = JSON.parse(json);
	var stringifiedConfig = JSON.stringify(parsed.whitelist);
	var auditMessage = null;
	var saltPrng = null;
	var trimmedHmac = null;
	var hexSalt = null;
	var xAudit = "";
	var prng = new Uint32Array(1);
	passAudit = false;
	
	console.log("StringifiedConfig: " + stringifiedConfig);
	
	console.log("Audit Status: " + passAudit);
	
	function show_pass_fail(passes) {
		var messageStatus = "";
		
		if (passes != null) {
			if (passes) {
				messageStatus = "Passed";
			} else {
				messageStatus = "Failed";
			}
		} else {
			messageStatus = "Unknown";
		}
		return messageStatus;
	}
	
	auditMessage = show_pass_fail(passAudit);
	
	//Use SHA256 to turn the configuration file into a key"
	var hashKey = CryptoJS.SHA256(stringifiedConfig);
	console.log("Hash Key: " + hashKey+ "\nShow Message: " + auditMessage);
	
	saltPrng = window.crypto.getRandomValues(prng);
	
	console.log("Salted PRNG: " + saltPrng);
	
	createHmac_And_Assemble(hashKey, saltPrng, auditMessage, function (hMACKey){
		var convertString = new Number(saltPrng);
		
		hmacLength = hMACKey.length - 16;
		trimmedHmac = hMACKey.substring(0, hmacLength);
		hexSalt = (convertString).toString(16).toUpperCase();
		
		xAudit = auditMessage + " " + hexSalt + trimmedHmac;
		 
		console.log("This is the HMAC: " + hMACKey + "\nLength: " + hmacLength + "\nTrimmed HMAC: " + trimmedHmac);
		console.log("X-Audit: " + xAudit);
		
		$.post('http://10.5.128.71', 'xAudit', function(status) {
			alert("Status: " + status);
		});
	});
 })
  .fail(function(error) {
    console.log(error);
  });
});

function createHmac_And_Assemble(key, salt, message, done){
	var saltedMessage = salt + message;
	var hMAC = CryptoJS.HmacSHA256(saltedMessage, key).toString();
	
	done(hMAC);
}
//This function gets and separates the UrlList from the rest of the configuration
//function splitConfig(done){
	