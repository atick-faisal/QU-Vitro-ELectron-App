const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    send: (data) => ipcRenderer.invoke("send", data),
    receive: (callback) => ipcRenderer.on("receive", callback),
});
