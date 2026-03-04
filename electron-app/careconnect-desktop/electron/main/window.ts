import { BrowserWindow } from "electron";
import path from "node:path";

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1400,
    height: 850,
    show: false,
    backgroundColor: "#f6f9ff",
    webPreferences: {
      // __dirname points at dist-electron/electron/main when compiled/packaged;
      // preload lives in the sibling `preload` directory after build.
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // show only when renderer is ready (avoids white/blank flash)
  win.once("ready-to-show", () => win.show());

  // log load events to catch missing files or CSP failures
  win.webContents.on("did-finish-load", () => {
    console.log("renderer finished loading", win.webContents.getURL());
  });
  win.webContents.on("did-fail-load", (_e, code, desc, url) => {
    console.error("renderer failed to load", { code, desc, url });
  });

  // in production it's helpful to open devtools briefly when troubleshooting
  // win.webContents.openDevTools({ mode: 'detach' });

  return win;
}