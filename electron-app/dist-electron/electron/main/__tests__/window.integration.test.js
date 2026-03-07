"use strict";
/** @jest-environment node */
Object.defineProperty(exports, "__esModule", { value: true });
const showMock = jest.fn();
const onceMock = jest.fn();
const webContentsOnMock = jest.fn();
const getURLMock = jest.fn(() => "http://localhost:5173");
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
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
const window_1 = require("../window");
describe("createMainWindow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    test("creates BrowserWindow with expected options", () => {
        (0, window_1.createMainWindow)();
        expect(BrowserWindowMock).toHaveBeenCalledTimes(1);
        const browserWindowMock = BrowserWindowMock;
        const firstCall = browserWindowMock.mock.calls[0];
        expect(firstCall).toBeDefined();
        const options = firstCall[0];
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
        (0, window_1.createMainWindow)();
        expect(onceMock).toHaveBeenCalledWith("ready-to-show", expect.any(Function));
        const readyHandler = onceMock.mock.calls.find(([event]) => event === "ready-to-show")?.[1];
        expect(readyHandler).toBeDefined();
        readyHandler();
        expect(showMock).toHaveBeenCalled();
    });
    test("registers did-finish-load handler and logs current URL", () => {
        (0, window_1.createMainWindow)();
        expect(webContentsOnMock).toHaveBeenCalledWith("did-finish-load", expect.any(Function));
        const finishHandler = webContentsOnMock.mock.calls.find(([event]) => event === "did-finish-load")?.[1];
        expect(finishHandler).toBeDefined();
        finishHandler();
        expect(getURLMock).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("renderer finished loading", "http://localhost:5173");
    });
    test("registers did-fail-load handler and logs error details", () => {
        (0, window_1.createMainWindow)();
        expect(webContentsOnMock).toHaveBeenCalledWith("did-fail-load", expect.any(Function));
        const failHandler = webContentsOnMock.mock.calls.find(([event]) => event === "did-fail-load")?.[1];
        expect(failHandler).toBeDefined();
        failHandler({}, -106, "ERR_INTERNET_DISCONNECTED", "http://localhost:5173");
        expect(consoleErrorSpy).toHaveBeenCalledWith("renderer failed to load", {
            code: -106,
            desc: "ERR_INTERNET_DISCONNECTED",
            url: "http://localhost:5173",
        });
    });
});
