const {
    app,
    BrowserWindow
} = require('electron');

const DownloadManager = require("electron-download-manager");

DownloadManager.register({
    downloadFolder: app.getPath("downloads") + "/my-app"
});

function createWindow() {
    let win = new BrowserWindow({
        width: 1000,
        height: 650,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        maximizable: false,
        resizable: false
    })

    win.loadFile('app/home/index.html');

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);