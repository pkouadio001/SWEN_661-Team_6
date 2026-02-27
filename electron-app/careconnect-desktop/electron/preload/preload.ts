import { contextBridge, ipcRenderer } from "electron";
import { IPC, NavigatePayload } from "../shared/channels";

const api = {
  quitApp: () => ipcRenderer.send(IPC.QUIT_APP),

  getAppVersion: () => ipcRenderer.invoke(IPC.GET_VERSION) as Promise<string>,

  onNavigate: (cb: (route: NavigatePayload["route"]) => void) => {
    const handler = (_: unknown, payload: NavigatePayload) => cb(payload.route);
    ipcRenderer.on(IPC.NAVIGATE, handler);
    return () => ipcRenderer.removeListener(IPC.NAVIGATE, handler);
  }
};

contextBridge.exposeInMainWorld("careconnect", api);