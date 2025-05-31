const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (cfg) => ipcRenderer.invoke("save-config", cfg),
  connectOBS: () => ipcRenderer.invoke("connect-obs"),
  disconnectOBS: () => ipcRenderer.invoke("disconnect-obs"),
  getScenes: () => ipcRenderer.invoke("get-scenes"),
  obsStatus: () => ipcRenderer.invoke("obs-status"),
  getMonitors: () => ipcRenderer.invoke("get-monitors"),
});
