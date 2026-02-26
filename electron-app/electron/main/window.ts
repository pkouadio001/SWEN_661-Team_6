import { BrowserWindow } from "electron";
import path from "node:path";

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1400,
    height: 850,
    show: false,
    backgroundColor: "#f6f9ff",
    webPreferences: {
      preload: path.join(process.cwd(), "dist-electron/electron/preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.once("ready-to-show", () => win.show());
  return win;
}