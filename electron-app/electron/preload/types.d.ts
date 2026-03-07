import type { NavigatePayload } from "../shared/channels";

declare global {
  interface Window {
    careconnect: {
      quitApp: () => void;
      getAppVersion: () => Promise<string>;
      onNavigate: (cb: (route: NavigatePayload["route"]) => void) => () => void;
    };
  }
}

export {};