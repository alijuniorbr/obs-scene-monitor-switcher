const { app, BrowserWindow, screen, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const OBSWebSocket = require("obs-websocket-js").default;

let win;
let config = {};
let obs = null;
let obsConnected = false;
let lastMonitor = -1;
let sceneList = [];

function getConfigPath() {
  return path.join(__dirname, "config.json");
}

function loadConfig() {
  try {
    config = JSON.parse(fs.readFileSync(getConfigPath()));
  } catch {
    config = {
      obs: { ip: "localhost", port: 4455, password: "" },
      monitors: screen
        .getAllDisplays()
        .map((_, i) => ({ monitor: i, scene: "" })),
    };
    fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
  }
}

function saveConfig(newConfig) {
  config = newConfig;
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
}

async function connectOBS() {
  if (obsConnected) return true;
  if (!obs) obs = new OBSWebSocket();
  try {
    await obs.connect(
      `ws://${config.obs.ip}:${config.obs.port}`,
      config.obs.password
    );
    obsConnected = true;
    console.log("Conectado ao OBS!");
    await getScenesFromOBS();
    return true;
  } catch (err) {
    obsConnected = false;
    console.error("Erro ao conectar ao OBS:", err);
    return false;
  }
}

function disconnectOBS() {
  if (obs && obsConnected) {
    obs.disconnect();
    obsConnected = false;
  }
}

async function getScenesFromOBS() {
  try {
    const { scenes } = await obs.call("GetSceneList");
    sceneList = scenes.map((s) => s.sceneName);
    return sceneList;
  } catch (err) {
    console.error("Erro ao puxar lista de cenas:", err);
    sceneList = [];
    return [];
  }
}

async function switchSceneIfNeeded() {
  if (!obsConnected) return;
  const { x, y } = screen.getCursorScreenPoint();
  const displays = screen.getAllDisplays();
  for (let i = 0; i < displays.length; i++) {
    const d = displays[i].bounds;
    if (x >= d.x && x < d.x + d.width && y >= d.y && y < d.y + d.height) {
      if (i !== lastMonitor && config.monitors[i]?.scene) {
        lastMonitor = i;
        const scene = config.monitors[i].scene;
        console.log(`Mudando para cena: ${scene} (monitor ${i})`);
        try {
          await obs.call("SetCurrentProgramScene", { sceneName: scene });
        } catch (err) {
          console.error("Erro ao alternar cena:", err);
        }
      }
      break;
    }
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 850,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("renderer/index.html");
}

app.whenReady().then(() => {
  loadConfig();
  createWindow();
  setInterval(switchSceneIfNeeded, 500); // verifica a cada 500ms
});

// IPC handlers
ipcMain.handle("get-config", () => config);
ipcMain.handle("save-config", (_, newConfig) => {
  saveConfig(newConfig);
  return true;
});
ipcMain.handle("connect-obs", async () => {
  const ok = await connectOBS();
  return { ok, scenes: sceneList };
});
ipcMain.handle("disconnect-obs", () => {
  disconnectOBS();
  return true;
});
ipcMain.handle("get-scenes", async () => {
  if (!obsConnected) return [];
  return await getScenesFromOBS();
});
ipcMain.handle("obs-status", () => obsConnected);
ipcMain.handle("get-monitors", () => {
  // Monitores ativos do Electron
  const displays = screen.getAllDisplays();
  // Pega config para associar cenas
  return displays.map((disp, i) => ({
    index: i,
    bounds: disp.bounds,
    scene: config.monitors[i]?.scene || "",
  }));
});
