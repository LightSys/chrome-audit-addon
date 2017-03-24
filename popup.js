/**
 * @file
 * 
 */

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

function run_audit(){
	bg.supressAlert = false;
	bg.getAndCheckConfig();
}


/**
 * Close the window
 */
function close_window(){
  window.close();
}

// add listeners to rerun button
document.getElementById('rerun').addEventListener('click', run_audit);
document.getElementById('rerun').addEventListener('click', close_window);
