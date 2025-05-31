const { app, screen } = require("electron");
const OBSWebSocket = require("obs-websocket-js").default; // obs-websocket-js@5.x

const obs = new OBSWebSocket();

// Configurações do OBS WebSocket
const OBS_HOST = "localhost"; // ou IP da máquina do OBS
const OBS_PORT = 4455; // porta padrão
const OBS_PASSWORD = "123456"; // sua senha

// Mapeie os monitores para as cenas correspondentes
const SCENE_NAMES = [
  "vscode", //  Monitor 0
  "browser", // Monitor 1
  "browser", // Monitor 2
  // ...adicione mais cenas conforme sua necessidade!
];

let lastMonitor = -1;

async function connectOBS() {
  try {
    await obs.connect(`ws://${OBS_HOST}:${OBS_PORT}`, OBS_PASSWORD);
    console.log("Conectado ao OBS!");
  } catch (err) {
    console.error("Erro ao conectar ao OBS:", err);
    setTimeout(connectOBS, 5000); // tenta reconectar a cada 5s
  }
}

async function switchSceneIfNeeded() {
  const { x, y } = screen.getCursorScreenPoint();
  const displays = screen.getAllDisplays();

  for (let i = 0; i < displays.length; i++) {
    const d = displays[i].bounds;
    if (x >= d.x && x < d.x + d.width && y >= d.y && y < d.y + d.height) {
      if (i !== lastMonitor && i < SCENE_NAMES.length) {
        lastMonitor = i;
        const scene = SCENE_NAMES[i];
        console.log(`Mudando para cena: ${scene} (monitor ${i})`);
        try {
          await obs.call("SetCurrentProgramScene", { sceneName: scene });
        } catch (err) {
          console.error("Erro ao alternar cena:", err);
          // reconectar se perder a conexão
          if (err.code === "CONNECTION_CLOSED") {
            connectOBS();
          }
        }
      }
      break;
    }
  }
}

app.whenReady().then(() => {
  connectOBS();
  setInterval(switchSceneIfNeeded, 500); // checa a cada 0,8s
});

app.on("window-all-closed", () => {
  obs.disconnect();
  app.quit();
});
