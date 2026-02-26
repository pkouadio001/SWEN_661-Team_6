"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainWindow = createMainWindow;
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
function createMainWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1400,
        height: 850,
        show: false,
        backgroundColor: "#f6f9ff",
        webPreferences: {
            preload: node_path_1.default.join(process.cwd(), "dist-electron/electron/preload/preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });
    win.once("ready-to-show", () => win.show());
    return win;
}
