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
  // allow either variable depending on the tooling/version
  const devUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;

  if (devUrl) {
    // running in development; renderer is served by Vite
    await win.loadURL(devUrl);
  } else {
    // packaged – main.js sits under dist-electron/electron/main
    // the built renderer output lives in the `dist` folder at the project root,
    // which is copied by electron-builder into the app resources.
    const indexPath = path.join(__dirname, "../../../dist/index.html");
    await win.loadFile(indexPath);
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