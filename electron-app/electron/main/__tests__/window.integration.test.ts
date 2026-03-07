/** @jest-environment node */

const showMock = jest.fn();
const onceMock = jest.fn();
const webContentsOnMock = jest.fn();
const getURLMock = jest.fn(() => "http://localhost:5173");

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

const BrowserWindowMock = jest.fn(() => ({
  show: showMock,
  once: onceMock,
  webContents: {
    on: webContentsOnMock,
    getURL: getURLMock,
  },
}));

jest.mock("electron", () => ({
  BrowserWindow: BrowserWindowMock,
}));

import { createMainWindow } from "../window";

describe("createMainWindow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("creates BrowserWindow with expected options", () => {
    createMainWindow();

    expect(BrowserWindowMock).toHaveBeenCalledTimes(1);

    const browserWindowMock = BrowserWindowMock as jest.Mock;
    const firstCall = browserWindowMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const options = firstCall[0] as any;
    expect(options).toBeDefined();

    expect(options).toMatchObject({
      width: 1400,
      height: 850,
      show: false,
      backgroundColor: "#f6f9ff",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    expect(options.webPreferences.preload).toContain("preload.js");
  });

  test("registers ready-to-show handler that shows the window", () => {
    createMainWindow();

    expect(onceMock).toHaveBeenCalledWith(
      "ready-to-show",
      expect.any(Function)
    );

    const readyHandler = (onceMock as jest.Mock).mock.calls.find(
      ([event]) => event === "ready-to-show"
    )?.[1] as Function | undefined;

    expect(readyHandler).toBeDefined();
    readyHandler!();

    expect(showMock).toHaveBeenCalled();
  });

  test("registers did-finish-load handler and logs current URL", () => {
    createMainWindow();

    expect(webContentsOnMock).toHaveBeenCalledWith(
      "did-finish-load",
      expect.any(Function)
    );

    const finishHandler = (webContentsOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "did-finish-load"
    )?.[1] as Function | undefined;

    expect(finishHandler).toBeDefined();
    finishHandler!();

    expect(getURLMock).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "renderer finished loading",
      "http://localhost:5173"
    );
  });

  test("registers did-fail-load handler and logs error details", () => {
    createMainWindow();

    expect(webContentsOnMock).toHaveBeenCalledWith(
      "did-fail-load",
      expect.any(Function)
    );

    const failHandler = (webContentsOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "did-fail-load"
    )?.[1] as Function | undefined;

    expect(failHandler).toBeDefined();
    failHandler!({}, -106, "ERR_INTERNET_DISCONNECTED", "http://localhost:5173");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "renderer failed to load",
      {
        code: -106,
        desc: "ERR_INTERNET_DISCONNECTED",
        url: "http://localhost:5173",
      }
    );
  });
});