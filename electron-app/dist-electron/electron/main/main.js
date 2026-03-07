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
let mainWindow = null;
function getWindow() {
    return mainWindow;
}
async function loadRenderer(win) {
    // allow either variable depending on the tooling/version
    const devUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
        // running in development; renderer is served by Vite
        await win.loadURL(devUrl);
    }
    else {
        // packaged – main.js sits under dist-electron/electron/main
        // the built renderer output lives in the `dist` folder at the project root,
        // which is copied by electron-builder into the app resources.
        const indexPath = node_path_1.default.join(__dirname, "../../../dist/index.html");
        await win.loadFile(indexPath);
    }
}
electron_1.app.whenReady().then(async () => {
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
