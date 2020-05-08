const remote = require('electron').remote;

var pages = ['home', 'download']
var currentPageID = 0;

function nextPage() {
    currentPageID++;
    if(currentPageID < pages.length) {
        window.location.href = `../${pages[currentPageID]}/index.html`;
    }
}

function previousPage(params) {
    currentPageID++;
    if(currentPageID > 0) {
        window.location.href = `../${pages[currentPageID]}/index.html`;
    }
}

function nextPage() {
    window.location.href = '../download/index.html';
}

function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}

function downsLoadFile(url) {
    remote.require("electron-download-manager").download({
        url: url
    }, function (error, info) {
        if (error) {
            console.log(error);
            return;
        }

        console.log("DONE: " + info.url);
    });
}