const { app, BrowserWindow, ipcMain } = require("electron");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("node:path");

let win;
let port = null;

const handleSerialComm = async () => {
    const ports = await SerialPort.list();
    port = new SerialPort({
        path: ports.filter((port) => port?.pnpId?.includes("CP210"))[0].path,
        baudRate: 115200,
    });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    port.on("error", function (err) {
        console.log("Error: ", err.message);
    });

    parser.on("data", (data) => {
        win.webContents.send("onSerialRead", data);
    });
};

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 480,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "assets/pump.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile("index.html");
    // win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle("connect", async () => {
        console.warn("Connecting ... ");
        try {
            await handleSerialComm();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    });

    ipcMain.handle("disconnect", async () => {
        console.warn("Disconnecting ... ");
        await port.close();
        port = null;
    });

    ipcMain.handle("writeToSerial", (_, data) => {
        console.warn(data);
        port?.write(data);
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
