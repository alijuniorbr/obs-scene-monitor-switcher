let monitors = [];
let scenes = [];
let config = {};

const statusEl = document.getElementById("status");
const obsStatusEl = document.getElementById("obs-status");
const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");

async function updateOBSStatus() {
  const connected = await window.electronAPI.obsStatus();
  obsStatusEl.textContent = connected ? "OBS Conectado" : "OBS Desconectado";
  obsStatusEl.style.color = connected ? "green" : "red";
  connectBtn.style.display = connected ? "none" : "";
  disconnectBtn.style.display = connected ? "" : "none";
}

async function refreshScenes() {
  statusEl.textContent = "Obtendo as cenas...";
  scenes = (await window.electronAPI.getScenes()) || [];
}

async function renderMonitors() {
  const container = document.getElementById("monitores");
  container.innerHTML = "";
  monitors.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "monitor";
    div.innerHTML = `
      <div class="monitor-num">Monitor ${i + 1} (${m.bounds.width}x${
      m.bounds.height
    })</div>
      <label>Cena OBS:
        <select id="scene-${i}">
          <option value="">(não alternar)</option>
          ${scenes
            .map(
              (scene) =>
                `<option value="${scene}"${
                  m.scene === scene ? " selected" : ""
                }>${scene}</option>`
            )
            .join("")}
        </select>
      </label>
    `;
    container.appendChild(div);
  });
}

async function loadAll() {
  config = await window.electronAPI.getConfig();
  monitors = await window.electronAPI.getMonitors();
  // Preenche IP/porta/senha na tela
  document.getElementById("obs-ip").value = config.obs.ip || "localhost";
  document.getElementById("obs-port").value = config.obs.port || 4455;
  document.getElementById("obs-password").value = config.obs.password || "";
  await updateOBSStatus();
  await refreshScenes();
  await renderMonitors();
}

connectBtn.onclick = async () => {
  // Atualiza config com valores da tela
  config.obs.ip = document.getElementById("obs-ip").value.trim();
  config.obs.port =
    parseInt(document.getElementById("obs-port").value, 10) || 4455;
  config.obs.password = document.getElementById("obs-password").value.trim();
  await window.electronAPI.saveConfig(config);
  statusEl.textContent = "Conectando...";

  const { ok } = await window.electronAPI.connectOBS();
  await updateOBSStatus();

  if (ok) {
    await refreshScenes();
    // Chama getScenes para garantir que a lista está disponível
    //scenes = await window.electronAPI.getScenes();
    statusEl.textContent = "Conectado ao OBS!";
    await renderMonitors();
  } else {
    scenes = [];
    await renderMonitors();
    statusEl.textContent = "Falha ao conectar ao OBS!";
  }
};

disconnectBtn.onclick = async () => {
  await window.electronAPI.disconnectOBS();
  scenes = [];
  await renderMonitors();
  statusEl.textContent = "Desconectado do OBS";
  await updateOBSStatus();
};

document.getElementById("save").onclick = async () => {
  monitors.forEach((m, i) => {
    m.scene = document.getElementById(`scene-${i}`).value || "";
  });
  config.monitors = monitors;
  config.obs.ip = document.getElementById("obs-ip").value.trim();
  config.obs.port =
    parseInt(document.getElementById("obs-port").value, 10) || 4455;
  config.obs.password = document.getElementById("obs-password").value.trim();
  await window.electronAPI.saveConfig(config);
  statusEl.textContent = "Configuração salva!";
};

window.onload = loadAll;
