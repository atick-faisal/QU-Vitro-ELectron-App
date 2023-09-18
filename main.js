const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { time } = require("node:console");
const path = require("node:path");

let win;
let i = 0;
let timer;

const createWindow = () => {
    win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile("index.html");
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    ipcMain.handle("send", (_, data) => {
        console.warn(data);
    });

    timer = setInterval(() => {
        win.webContents.send("receive", i++);
    }, 1000);

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        timer.clearInterval();
        app.quit();
    }
});
