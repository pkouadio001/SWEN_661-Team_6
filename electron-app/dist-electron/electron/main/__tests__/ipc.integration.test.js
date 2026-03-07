"use strict";
/** @jest-environment node */
Object.defineProperty(exports, "__esModule", { value: true });
const mockHandle = jest.fn();
const mockOn = jest.fn();
const mockQuit = jest.fn();
const mockGetVersion = jest.fn(() => "1.2.3");
jest.mock("electron", () => ({
    app: {
        getVersion: mockGetVersion,
        quit: mockQuit,
    },
    ipcMain: {
        handle: mockHandle,
        on: mockOn,
    },
}));
const ipc_1 = require("../ipc");
const channels_1 = require("../../shared/channels");
describe("registerIpcHandlers", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("registers GET_VERSION handler", async () => {
        const getWindow = jest.fn(() => null);
        (0, ipc_1.registerIpcHandlers)(getWindow);
        expect(mockHandle).toHaveBeenCalledWith(channels_1.IPC.GET_VERSION, expect.any(Function));
        const handler = mockHandle.mock.calls.find(([channel]) => channel === channels_1.IPC.GET_VERSION)?.[1];
        expect(handler).toBeDefined();
        const result = await handler();
        expect(result).toBe("1.2.3");
        expect(mockGetVersion).toHaveBeenCalled();
    });
    test("registers QUIT_APP listener and quits app when invoked", () => {
        const getWindow = jest.fn(() => null);
        (0, ipc_1.registerIpcHandlers)(getWindow);
        expect(mockOn).toHaveBeenCalledWith(channels_1.IPC.QUIT_APP, expect.any(Function));
        const quitListener = mockOn.mock.calls.find(([channel]) => channel === channels_1.IPC.QUIT_APP)?.[1];
        expect(quitListener).toBeDefined();
        quitListener();
        expect(mockQuit).toHaveBeenCalled();
    });
    test("registers NAVIGATE listener and forwards payload to renderer", () => {
        const sendMock = jest.fn();
        const mockWindow = {
            webContents: {
                send: sendMock,
            },
        };
        const getWindow = jest.fn(() => mockWindow);
        (0, ipc_1.registerIpcHandlers)(getWindow);
        expect(mockOn).toHaveBeenCalledWith(channels_1.IPC.NAVIGATE, expect.any(Function));
        const navigateListener = mockOn.mock.calls.find(([channel]) => channel === channels_1.IPC.NAVIGATE)?.[1];
        expect(navigateListener).toBeDefined();
        const payload = { route: "/dashboard" };
        navigateListener({}, payload);
        expect(getWindow).toHaveBeenCalled();
        expect(sendMock).toHaveBeenCalledWith(channels_1.IPC.NAVIGATE, payload);
    });
    test("does not fail when NAVIGATE is received but window is null", () => {
        const getWindow = jest.fn(() => null);
        (0, ipc_1.registerIpcHandlers)(getWindow);
        const navigateListener = mockOn.mock.calls.find(([channel]) => channel === channels_1.IPC.NAVIGATE)?.[1];
        expect(() => navigateListener({}, { route: "/login" })).not.toThrow();
        expect(getWindow).toHaveBeenCalled();
    });
});
