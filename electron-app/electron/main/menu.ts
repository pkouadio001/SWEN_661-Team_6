import { Menu, BrowserWindow, shell, dialog } from "electron";
import { IPC, NavigatePayload } from "../shared/channels";

export function setAppMenu(getWindow: () => BrowserWindow | null) {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            const win = getWindow();
            if (win) win.focus();
          }
        },
        {
          label: "Logout",
          accelerator: "CmdOrCtrl+L",
          click: () => {
            const win = getWindow();
            const payload: NavigatePayload = { route: "/login" };
            win?.webContents.send(IPC.NAVIGATE, payload);
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
            await dialog.showMessageBox({
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
            await shell.openExternal("https://electronjs.org");
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}