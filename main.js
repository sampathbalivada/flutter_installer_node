const {
    app,
    BrowserWindow
} = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        width: 1000,
        height: 650,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        maximizable: false 
    })

    win.loadFile('home/index.html');

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);