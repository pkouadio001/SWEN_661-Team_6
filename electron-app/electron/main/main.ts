import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./window";
import { setAppMenu } from "./menu";
import { registerIpcHandlers } from "./ipc";
import path from "node:path";

let mainWindow: BrowserWindow | null = null;

function getWindow() {
  return mainWindow;
}




async function loadRenderer(win: BrowserWindow) {
  const devUrl = process.env.ELECTRON_RENDERER_URL;

  if (devUrl) {
    await win.loadURL(devUrl);
  } else {
    await win.loadFile(path.join(process.cwd(), "dist", "index.html"));
  }
}

app.whenReady().then(async () => {
  mainWindow = createMainWindow();
  setAppMenu(getWindow);
  registerIpcHandlers(getWindow);

  await loadRenderer(mainWindow);

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      setAppMenu(getWindow);
      registerIpcHandlers(getWindow);
      await loadRenderer(mainWindow);
    }
  });
});

app.on("window-all-closed", () => {
  // On macOS, apps commonly stay open; keep standard behavior
  if (process.platform !== "darwin") app.quit();
});