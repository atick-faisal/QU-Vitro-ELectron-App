const { app, BrowserWindow, ipcMain } = require("electron");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("node:path");

let win;
let i = 0;
let timer;

const handleSerialComm = async () => {
    const ports = await SerialPort.list();
    const port = new SerialPort({
        path: ports.filter((port) => port.pnpId?.includes("CP210"))[0]?.path,
        baudRate: 115200,
    });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    port.on("error", function (err) {
        console.log("Error: ", err.message);
    });

    parser.on("data", (data) => {
        win.webContents.send("onSerialRead", data);
    });

    ipcMain.handle("writeToSerial", (_, data) => {
        console.warn(data);
        port.write(data);
    });

    // timer = setInterval(() => {
    //     port.write(
    //         "<0,32,64,95,125,152,177,199,218,233,244,251,254,253,248,239,226,209,188,165,139,110,80,48,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>"
    //     );
    // }, 5000);
};

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
    timer = setInterval(() => {
        win.webContents.send("receive", i++);
    }, 1000);

    handleSerialComm();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        clearInterval(timer);
        app.quit();
    }
});
