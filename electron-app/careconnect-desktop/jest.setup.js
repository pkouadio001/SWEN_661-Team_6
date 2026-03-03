require('@testing-library/jest-dom');

global.window = global.window || {};
global.window.careconnect = {
  quitApp: jest.fn(),
  getAppVersion: jest.fn(() => Promise.resolve('1.0.0')),
  onNavigate: jest.fn(() => jest.fn()),
};