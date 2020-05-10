const remote = require('electron').remote;
const shell = require('electron').shell;

var pages = ['home', 'download', 'install', 'finish']

function nextPage(currentPageID) {
    currentPageID++;
    if (currentPageID < pages.length) {
        window.location.href = `../${pages[currentPageID]}/index.html`;
    }
}

function previousPage(currentPageID) {
    currentPageID--;
    if (currentPageID > 0) {
        window.location.href = `../${pages[currentPageID]}/index.html`;
    }
}

function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}

function reset() {
    currentPageID = 0;
    window.location.href = `../${pages[currentPageID]}/index.html`;
}

function openURL(url) {
    shell.openExternal(url);
}