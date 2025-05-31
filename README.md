# OBS Scene Monitor Switcher

Um app Electron que **troca automaticamente a cena do OBS Studio conforme o monitor onde está o mouse**, ideal para setups multi-monitor, streaming ou automações.

- Permite configurar qual cena do OBS será ativada para cada monitor.
- Interface gráfica simples: selecione os monitores, associe a cena via dropdown.
- Configuração de IP, porta e senha do OBS (via obs-websocket).
- Conexão/desconexão manual.
- Roda em background: minimiza para a barra de status do Mac (System Tray), ou para a bandeja do Windows.
- **Cross-platform:** funciona no macOS e Windows.

---

## Como Funciona

1. O app detecta em qual monitor o mouse está (ao vivo).
2. Cada monitor pode ser associado a uma cena do OBS Studio.
3. Quando você move o mouse para outro monitor, a cena do OBS troca automaticamente.
4. Você pode configurar IP, porta e senha do OBS (precisa do [plugin obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/)).
5. O app fica minimizado na barra de status (macOS) ou na bandeja (Windows).

---

## Pré-requisitos

- **Node.js 18+** (preferencialmente LTS)
- **OBS Studio** com [obs-websocket plugin](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/) ativado
  - No OBS 28+ já vem integrado, basta habilitar em “Ferramentas > WebSocket Server Settings”
- **npm** (ou yarn/pnpm se preferir)

---

## Instalação e Execução (Desenvolvimento)

### 1. Clone o repositório

```bash
git clone https://github.com/alijuniorbr/obs-scene-monitor-switcher
cd obs-scene-monitor-switcher
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode o app

```bash
npm start
```

O app abrirá com a interface gráfica para configuração.

---

## Build para distribuição

### **macOS (app standalone .app/.dmg)**

1. Instale o [electron-builder](https://www.electron.build/) (global ou dev dependency):
   ```bash
   npm install --save-dev electron-builder
   ```
2. No `package.json`, adicione:
   ```json
   "build": {
     "appId": "br.com.alijunior.obs-scene-monitor-switcher",
     "mac": { "category": "public.app-category.utilities" },
     "win": { "target": "nsis" },
     "files": [
       "main.js",
       "preload.js",
       "renderer/",
       "config.json",
       "iconTemplate.png",
       "package.json"
     ]
   },
   "scripts": {
     "start": "electron .",
     "dist": "electron-builder"
   }
   ```
3. Para compilar o app para Mac:
   ```bash
   npm run dist
   ```
   O instalador `.dmg`/`.app` será gerado na pasta `dist/`.

### **Windows (.exe Installer)**

O mesmo comando funciona em um PC com Windows:

```bash
npm run dist
```

O instalador `.exe` será gerado na pasta `dist/`.

> **Observação:** Para compilar para outro sistema operacional (cross-compile), o ideal é rodar o comando _no próprio sistema alvo_ (por limitações de dependências nativas do Electron, especialmente Mac para Windows).

---

## Uso

1. Abra o app.
2. Configure o IP, porta e senha do seu OBS.
3. Clique em “Conectar”. Aguarde a lista de cenas aparecer.
4. Para cada monitor exibido, escolha qual cena do OBS deve ser ativada.
5. Clique em “Salvar Configuração”.
6. O app pode ser minimizado — ele ficará na barra de status/bandeja, alternando as cenas automaticamente.

---

## Dúvidas comuns

### **Funciona no Windows?**

Sim! Funciona no macOS e Windows. No Windows, o app minimiza para a bandeja próxima ao relógio.

### **Funciona no Linux?**

A detecção de monitores pode funcionar em várias distros, mas o suporte ao tray e a integração com o OBS não são totalmente garantidos/testados.

### **Posso compilar um app só para Mac ou só para Windows?**

Sim!

- Em um Mac, `npm run dist` gera o instalador `.dmg` ou `.app` para Mac.
- Em um PC com Windows, `npm run dist` gera o `.exe` instalador.
- Para compilar para outro SO, rode o comando _no sistema desejado_ (ou use CI cross-platform com Docker/VMs).

---

## Contribuições

Sinta-se à vontade para abrir Issues, Pull Requests ou sugerir melhorias!

---

## Licença

MIT
