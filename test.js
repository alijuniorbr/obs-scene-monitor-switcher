const { app, screen } = require("electron");

function getMouseMonitorIndex() {
  const { x, y } = screen.getCursorScreenPoint();
  const displays = screen.getAllDisplays();

  for (let i = 0; i < displays.length; i++) {
    const d = displays[i].bounds;
    if (x >= d.x && x < d.x + d.width && y >= d.y && y < d.y + d.height) {
      return i;
    }
  }
  return -1;
}

app.whenReady().then(() => {
  setInterval(() => {
    const idx = getMouseMonitorIndex();
    const displays = screen.getAllDisplays();
    if (idx !== -1) {
      const display = displays[idx];
      console.log(
        `Mouse está no monitor ${idx} (${display.bounds.width}x${display.bounds.height} | Pos: x=${display.bounds.x}, y=${display.bounds.y})`
      );
    } else {
      console.log("Mouse fora dos monitores detectados!");
    }
  }, 1000);
});

app.on("window-all-closed", () => {
  app.quit();
});
