const remote = require('electron').remote;

var pages = ['home', 'download', 'install']

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

function reset() {
    currentPageID = 0;
    window.location.href = `../${pages[currentPageID]}/index.html`;
}