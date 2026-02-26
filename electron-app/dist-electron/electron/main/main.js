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
    const devUrl = process.env.ELECTRON_RENDERER_URL;
    if (devUrl) {
        await win.loadURL(devUrl);
    }
    else {
        await win.loadFile(node_path_1.default.join(process.cwd(), "dist", "index.html"));
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
