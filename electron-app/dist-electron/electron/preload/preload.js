"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const channels_1 = require("../shared/channels");
const api = {
    quitApp: () => electron_1.ipcRenderer.send(channels_1.IPC.QUIT_APP),
    getAppVersion: () => electron_1.ipcRenderer.invoke(channels_1.IPC.GET_VERSION),
    onNavigate: (cb) => {
        const handler = (_, payload) => cb(payload.route);
        electron_1.ipcRenderer.on(channels_1.IPC.NAVIGATE, handler);
        return () => electron_1.ipcRenderer.removeListener(channels_1.IPC.NAVIGATE, handler);
    }
};
electron_1.contextBridge.exposeInMainWorld("careconnect", api);
