import { app, BrowserWindow, session } from "electron";
import { createMainWindow } from "./window";
import { setAppMenu } from "./menu";
import { registerIpcHandlers } from "./ipc";
import path from "node:path";
import fs from "node:fs";

let mainWindow: BrowserWindow | null = null;

function getWindow() {
  return mainWindow;
}

const AXE_EXTENSION_ID = "lhdoppojpmngadmnindnejefpokejbdd";

function compareSemverLike(a: string, b: string): number {
  const aParts = a.split(".").map((part) => Number(part));
  const bParts = b.split(".").map((part) => Number(part));
  const max = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < max; i += 1) {
    const aVal = Number.isFinite(aParts[i]) ? aParts[i] : 0;
    const bVal = Number.isFinite(bParts[i]) ? bParts[i] : 0;
    if (aVal !== bVal) return aVal - bVal;
  }

  return 0;
}

async function maybeLoadAxeDevToolsExtension() {
  if (app.isPackaged) return;

  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    console.warn("[axe] LOCALAPPDATA is not set; skipping axe DevTools extension load.");
    return;
  }

  const extensionRoot = path.join(
    localAppData,
    "Google",
    "Chrome",
    "User Data",
    "Default",
    "Extensions",
    AXE_EXTENSION_ID,
  );

  if (!fs.existsSync(extensionRoot)) {
    console.warn(`[axe] Extension directory not found: ${extensionRoot}`);
    return;
  }

  const versions = fs
    .readdirSync(extensionRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareSemverLike);

  const latestVersion = versions.at(-1);
  if (!latestVersion) {
    console.warn(`[axe] No version folders found in: ${extensionRoot}`);
    return;
  }

  const extensionPath = path.join(extensionRoot, latestVersion);

  if (!session?.defaultSession) {
    console.warn("[axe] Electron defaultSession is unavailable; skipping extension load.");
    return;
  }

  try {
    await session.defaultSession.loadExtension(extensionPath, { allowFileAccess: true });
    console.log(`[axe] Loaded axe DevTools from: ${extensionPath}`);
  } catch (error) {
    console.error("[axe] Failed to load axe DevTools extension:", error);
  }
}




async function loadRenderer(win: BrowserWindow) {
  // allow either variable depending on the tooling/version
  const devUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;

  if (devUrl) {
    // running in development; renderer is served by Vite
    await win.loadURL(devUrl);
  } else {
    if (!app.isPackaged) {
      console.warn(
        "[axe] Renderer loaded via file://. axe DevTools may fail to analyze this page. Use `npm run axe:dev` to run over http://localhost:5173.",
      );
    }

    // packaged – main.js sits under dist-electron/electron/main
    // the built renderer output lives in the `dist` folder at the project root,
    // which is copied by electron-builder into the app resources.
    const indexPath = path.join(__dirname, "../../../dist/index.html");
    await win.loadFile(indexPath);
  }
}

app.whenReady().then(async () => {
  await maybeLoadAxeDevToolsExtension();

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