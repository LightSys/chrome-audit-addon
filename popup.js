var bg = chrome.extension.getBackgroundPage();

var passes = bg.passAudit;

if (passes != null) {
	if (passes) { 
		$("#passFailLabel").text("Audit Passed");
		$("#popupIcon").prepend("<img align='center' src='icon/icon128x128.png'>");
	} else {
		$("#passFailLabel").text("Audit Failed");
		$("#popupIcon").prepend("<img align='center' src='icon/fail-icon128x128.png'>");
	}
} else {
	$("#passFailLabel").text("Unknown Audit Result");
	$("#popupIcon").prepend("<img align='center' src='icon/icon128x128.png'>");
}

