const remote = require('electron').remote;

function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}