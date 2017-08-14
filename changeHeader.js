/*
* @file
* The changeHeader file adds an extra HTTP header (X-Audit) to requests when visiting secure websites, with the information if the browser passed the security audit.
*
* ChangeHeader Requirements:
*
* 0. Split Configuration file into two; Secured URLs and the rest of the configuration (Currently only split and used the whitelist).
*
* 1. Hash the configuration file (whitelist in this case) using sha256 (done).
*
* 2. Determine the message from the add-on audit whether it is a "pass" or a "fail" (Right now it is hardcoded to "fail" because it doesn't correctly return the message. This problem could be from the background.js).
*
* 3. Generate a salt via the Cryptological Psuedo Random Number Generator (CPRNG) (done).
*
* 4. Create HMAC using HMAC-SHA256. First concatenate the message ("pass" or "fail") with the generated salt then get HMAC using config hash from step 1 as the key (done).
*
* 5. Assemble Header: The X-Audit header will be a concatenation of the message, a 64 bit salt converted to hex, and the HMAC trimmed to 192 bits (done).
*
* 6. Send the X-Audit to the host server (I am getting the error "No Access-Control-Allow-Origin").
*
*/


// get the json file and X-Audit header
getConfigUrl(function(configUrl){
	
	//Checks if there is anything in the configUrl
  console.log("Result: " + configUrl);
  /*$.get(configUrl, function(json) {
	var parsed = JSON.parse(json);
	var stringifiedConfig = JSON.stringify(parsed.whitelist);
	console.log("StringifiedConfig: " + stringifiedConfig);
  });*/
  
  //gets json file from configUrl
  $.ajax({url: configUrl, cache: false})
  .done(function(json) {
	  //parses file and a store in variable, then stringifies and stores.
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
		
		/*$.post('http://10.5.128.71', 'xAudit', function(status) {
			alert("Status: " + status);
		});*/
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
	