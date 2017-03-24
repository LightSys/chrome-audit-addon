/*
* @file
* This script sets the dynamic objects in the popup window, and sets the "Run Audit" button's action.
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

/*
* Triggered by clicking the "Run Audit" button in the popup, this runs an audit, 
* and notifies the user of any failures.
*/
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
document.getElementById('runButton').addEventListener('click', run_audit);
document.getElementById('runButton').addEventListener('click', close_window);
