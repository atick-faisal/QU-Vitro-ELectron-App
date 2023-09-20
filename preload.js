const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    connect: async () => ipcRenderer.invoke("connect"),
    disconnect: async () => ipcRenderer.invoke("disconnect"),
    writeToSerial: (data) => ipcRenderer.invoke("writeToSerial", data),
    onSerialRead: (callback) => ipcRenderer.on("onSerialRead", callback),
});
