"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const window_1 = require("./window");
const menu_1 = require("./menu");
const ipc_1 = require("./ipc");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
let mainWindow = null;
function getWindow() {
    return mainWindow;
}
const AXE_EXTENSION_ID = "lhdoppojpmngadmnindnejefpokejbdd";
function compareSemverLike(a, b) {
    const aParts = a.split(".").map((part) => Number(part));
    const bParts = b.split(".").map((part) => Number(part));
    const max = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < max; i += 1) {
        const aVal = Number.isFinite(aParts[i]) ? aParts[i] : 0;
        const bVal = Number.isFinite(bParts[i]) ? bParts[i] : 0;
        if (aVal !== bVal)
            return aVal - bVal;
    }
    return 0;
}
async function maybeLoadAxeDevToolsExtension() {
    if (electron_1.app.isPackaged)
        return;
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
        console.warn("[axe] LOCALAPPDATA is not set; skipping axe DevTools extension load.");
        return;
    }
    const extensionRoot = node_path_1.default.join(localAppData, "Google", "Chrome", "User Data", "Default", "Extensions", AXE_EXTENSION_ID);
    if (!node_fs_1.default.existsSync(extensionRoot)) {
        console.warn(`[axe] Extension directory not found: ${extensionRoot}`);
        return;
    }
    const versions = node_fs_1.default
        .readdirSync(extensionRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort(compareSemverLike);
    const latestVersion = versions.at(-1);
    if (!latestVersion) {
        console.warn(`[axe] No version folders found in: ${extensionRoot}`);
        return;
    }
    const extensionPath = node_path_1.default.join(extensionRoot, latestVersion);
    if (!electron_1.session?.defaultSession) {
        console.warn("[axe] Electron defaultSession is unavailable; skipping extension load.");
        return;
    }
    try {
        await electron_1.session.defaultSession.loadExtension(extensionPath, { allowFileAccess: true });
        console.log(`[axe] Loaded axe DevTools from: ${extensionPath}`);
    }
    catch (error) {
        console.error("[axe] Failed to load axe DevTools extension:", error);
    }
}
async function loadRenderer(win) {
    // allow either variable depending on the tooling/version
    const devUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
        // running in development; renderer is served by Vite
        await win.loadURL(devUrl);
    }
    else {
        if (!electron_1.app.isPackaged) {
            console.warn("[axe] Renderer loaded via file://. axe DevTools may fail to analyze this page. Use `npm run axe:dev` to run over http://localhost:5173.");
        }
        // packaged – main.js sits under dist-electron/electron/main
        // the built renderer output lives in the `dist` folder at the project root,
        // which is copied by electron-builder into the app resources.
        const indexPath = node_path_1.default.join(__dirname, "../../../dist/index.html");
        await win.loadFile(indexPath);
    }
}
electron_1.app.whenReady().then(async () => {
    await maybeLoadAxeDevToolsExtension();
    mainWindow = (0, window_1.createMainWindow)();
    (0, menu_1.setAppMenu)(getWindow);
    (0, ipc_1.registerIpcHandlers)(getWindow);
    await loadRenderer(mainWindow);
    electron_1.app.on("activate", async () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            mainWindow = (0, window_1.createMainWindow)();
            (0, menu_1.setAppMenu)(getWindow);
            (0, ipc_1.registerIpcHandlers)(getWindow);
            await loadRenderer(mainWindow);
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    // On macOS, apps commonly stay open; keep standard behavior
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
