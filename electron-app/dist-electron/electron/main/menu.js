"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAppMenu = setAppMenu;
const electron_1 = require("electron");
const channels_1 = require("../shared/channels");
function setAppMenu(getWindow) {
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "New Window",
                    accelerator: "CmdOrCtrl+N",
                    click: () => {
                        const win = getWindow();
                        if (win)
                            win.focus();
                    }
                },
                {
                    label: "Logout",
                    accelerator: "CmdOrCtrl+L",
                    click: () => {
                        const win = getWindow();
                        const payload = { route: "/login" };
                        win?.webContents.send(channels_1.IPC.NAVIGATE, payload);
                    }
                },
                { type: "separator" },
                {
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click: () => {
                        const win = getWindow();
                        // also demonstrates main->renderer if you want:
                        win?.webContents.send("toast", { message: "Quitting..." });
                        process.nextTick(() => {
                            const { app } = require("electron");
                            app.quit();
                        });
                    }
                }
            ]
        },
        {
            label: "View",
            submenu: [
                { role: "reload", accelerator: "CmdOrCtrl+R" },
                { role: "toggleDevTools", accelerator: "CmdOrCtrl+Shift+I" },
                { role: "togglefullscreen", accelerator: "F11" }
            ]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "About CareConnect",
                    accelerator: "F1",
                    click: async () => {
                        await electron_1.dialog.showMessageBox({
                            type: "info",
                            title: "About CareConnect",
                            message: "CareConnect Desktop",
                            detail: "Your Personal Health Companion (Desktop Demo)"
                        });
                    }
                },
                {
                    label: "Documentation",
                    click: async () => {
                        await electron_1.shell.openExternal("https://electronjs.org");
                    }
                }
            ]
        }
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
