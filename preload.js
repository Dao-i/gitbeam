const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gitbeam", {
  minimize: () => ipcRenderer.send("minimize-window"),
  toggleMini: () => ipcRenderer.send("toggle-mini"),
  onMiniChanged: (cb) => ipcRenderer.on("mini-changed", (_, v) => cb(v)),
  onNextCard: (cb) => ipcRenderer.on("next-card", cb),
});
