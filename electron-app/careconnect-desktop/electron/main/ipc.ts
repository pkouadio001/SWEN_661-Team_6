import { app, ipcMain, BrowserWindow } from "electron";
import { IPC, NavigatePayload } from "../shared/channels";

export function registerIpcHandlers(getWindow: () => BrowserWindow | null) {
  ipcMain.handle(IPC.GET_VERSION, async () => app.getVersion());

  ipcMain.on(IPC.QUIT_APP, () => {
    app.quit();
  });

  // optional: allow renderer to request navigation
  ipcMain.on(IPC.NAVIGATE, (_evt, payload: NavigatePayload) => {
    const win = getWindow();
    win?.webContents.send(IPC.NAVIGATE, payload);
  });
}