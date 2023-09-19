const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    writeToSerial: (data) => ipcRenderer.invoke("writeToSerial", data),
    onSerialRead: (callback) => ipcRenderer.on("onSerialRead", callback),
});
