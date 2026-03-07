export {};

declare global {
  interface Window {
    careconnect: {
      quitApp: () => void;
    };
  }
}