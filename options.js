var configUrl = "";

// set_options stores a configuration url using chrome's storage API
// theConfigUrl: the url to be stored
function set_options(theConfigUrl){
  chrome.storage.sync.set({"ConfigUrl": theConfigUrl}, function(){
    console.log("Wrote url successfully (url: " + theConfigUrl + ")");
  });
}

// get_options accesses chrome's storage API
// done: function to access items.ConfigUrl
function get_options(done){
  chrome.storage.sync.get("ConfigUrl", function(items) {
    done(items.ConfigUrl);
  });
}

function close_window(){
  window.close();
}

// helper functions for event listeners
function get() {
  get_options(function(theConfigUrl) {
    configUrl = theConfigUrl;
    document.getElementById('urlText').value = configUrl;
  });
}

function set() {
  set_options(document.getElementById('urlText').value);
}

// load url when on start
document.addEventListener('DOMContentLoaded',
    get);

// add listeners to save button

document.getElementById('save').addEventListener('click',
    set);
document.getElementById('save').addEventListener('click',
    close_window);

// add listener for enter key that calls the save button when clicked
document.getElementById('urlText').addEventListener('keyup', function(event){
  event.preventDefault();
  if(event.keyCode == 13) {
    document.getElementById('save').click();
  }
});
