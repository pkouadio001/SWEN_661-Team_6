/** @jest-environment node */

const whenReadyMock = jest.fn();
const appOnMock = jest.fn();
const quitMock = jest.fn();
const getAllWindowsMock = jest.fn();

const loadURLMock = jest.fn().mockResolvedValue(undefined);
const loadFileMock = jest.fn().mockResolvedValue(undefined);

const createMainWindowMock = jest.fn(() => ({
  loadURL: loadURLMock,
  loadFile: loadFileMock,
}));

const setAppMenuMock = jest.fn();
const registerIpcHandlersMock = jest.fn();

jest.mock("electron", () => ({
  app: {
    whenReady: whenReadyMock,
    on: appOnMock,
    quit: quitMock,
  },
  BrowserWindow: {
    getAllWindows: getAllWindowsMock,
  },
}));

jest.mock("../window", () => ({
  createMainWindow: createMainWindowMock,
}));

jest.mock("../menu", () => ({
  setAppMenu: setAppMenuMock,
}));

jest.mock("../ipc", () => ({
  registerIpcHandlers: registerIpcHandlersMock,
}));

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

async function importMainFresh() {
  jest.resetModules();

  // Re-attach mocks after resetModules
  jest.doMock("electron", () => ({
    app: {
      whenReady: whenReadyMock,
      on: appOnMock,
      quit: quitMock,
    },
    BrowserWindow: {
      getAllWindows: getAllWindowsMock,
    },
  }));

  jest.doMock("../window", () => ({
    createMainWindow: createMainWindowMock,
  }));

  jest.doMock("../menu", () => ({
    setAppMenu: setAppMenuMock,
  }));

  jest.doMock("../ipc", () => ({
    registerIpcHandlers: registerIpcHandlersMock,
  }));

  jest.isolateModules(() => {
    require("../main");
  });

  await flushPromises();
  await flushPromises();
}

describe("main process lifecycle", () => {
  const originalPlatform = process.platform;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ELECTRON_RENDERER_URL = "http://localhost:5173";
    delete process.env.VITE_DEV_SERVER_URL;

    whenReadyMock.mockResolvedValue(undefined);
    getAllWindowsMock.mockReturnValue([]);
  });

  afterEach(() => {
    delete process.env.ELECTRON_RENDERER_URL;
    delete process.env.VITE_DEV_SERVER_URL;

    Object.defineProperty(process, "platform", {
      value: originalPlatform,
      configurable: true,
    });
  });

  test("creates window, sets menu, and registers IPC when app is ready", async () => {
    await importMainFresh();

    expect(whenReadyMock).toHaveBeenCalled();
    expect(createMainWindowMock).toHaveBeenCalledTimes(1);
    expect(setAppMenuMock).toHaveBeenCalledTimes(1);
    expect(registerIpcHandlersMock).toHaveBeenCalledTimes(1);
    expect(loadURLMock).toHaveBeenCalledWith("http://localhost:5173");
  });

  test("registers activate handler", async () => {
    await importMainFresh();

    const activateCall = (appOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "activate"
    );

    expect(activateCall).toBeDefined();
    expect(typeof activateCall?.[1]).toBe("function");
  });

  test("recreates window on activate when no windows exist", async () => {
    getAllWindowsMock.mockReturnValue([]);

    await importMainFresh();

    const activateHandler = (appOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "activate"
    )?.[1] as Function | undefined;

    expect(activateHandler).toBeDefined();

    await activateHandler!();

    expect(getAllWindowsMock).toHaveBeenCalled();
    expect(createMainWindowMock).toHaveBeenCalledTimes(2);
    expect(setAppMenuMock).toHaveBeenCalledTimes(2);
    expect(registerIpcHandlersMock).toHaveBeenCalledTimes(2);
  });

  test("does not recreate window on activate when one already exists", async () => {
    getAllWindowsMock.mockReturnValue([{}]);

    await importMainFresh();

    const activateHandler = (appOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "activate"
    )?.[1] as Function | undefined;

    expect(activateHandler).toBeDefined();

    await activateHandler!();

    expect(getAllWindowsMock).toHaveBeenCalled();
    expect(createMainWindowMock).toHaveBeenCalledTimes(1);
  });

  test("quits app on window-all-closed when not on darwin", async () => {
    Object.defineProperty(process, "platform", {
      value: "win32",
      configurable: true,
    });

    await importMainFresh();

    const windowClosedHandler = (appOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "window-all-closed"
    )?.[1] as Function | undefined;

    expect(windowClosedHandler).toBeDefined();

    windowClosedHandler!();

    expect(quitMock).toHaveBeenCalled();
  });

  test("does not quit app on window-all-closed when on darwin", async () => {
    Object.defineProperty(process, "platform", {
      value: "darwin",
      configurable: true,
    });

    await importMainFresh();

    const windowClosedHandler = (appOnMock as jest.Mock).mock.calls.find(
      ([event]) => event === "window-all-closed"
    )?.[1] as Function | undefined;

    expect(windowClosedHandler).toBeDefined();

    windowClosedHandler!();

    expect(quitMock).not.toHaveBeenCalled();
  });

  test("loads file when no dev URL is present", async () => {
    delete process.env.ELECTRON_RENDERER_URL;
    delete process.env.VITE_DEV_SERVER_URL;

    await importMainFresh();

    expect(loadFileMock).toHaveBeenCalledTimes(1);
    expect(loadURLMock).not.toHaveBeenCalled();
  });
});