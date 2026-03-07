"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpcHandlers = registerIpcHandlers;
const electron_1 = require("electron");
const channels_1 = require("../shared/channels");
function registerIpcHandlers(getWindow) {
    electron_1.ipcMain.handle(channels_1.IPC.GET_VERSION, async () => electron_1.app.getVersion());
    electron_1.ipcMain.on(channels_1.IPC.QUIT_APP, () => {
        electron_1.app.quit();
    });
    // optional: allow renderer to request navigation
    electron_1.ipcMain.on(channels_1.IPC.NAVIGATE, (_evt, payload) => {
        const win = getWindow();
        win?.webContents.send(channels_1.IPC.NAVIGATE, payload);
    });
}
