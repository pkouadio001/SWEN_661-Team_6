import React from "react";
import { screen } from "@testing-library/react";

const renderMock = jest.fn();
const createRootMock = jest.fn();

jest.mock("../app/App", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-app">App Loaded</div>,
}));

jest.mock("../state/activitiesStore", () => ({
  __esModule: true,
  ActivitiesProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="activities-provider">{children}</div>
  ),
}));

jest.mock("react-router-dom", () => ({
  __esModule: true,
  HashRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hash-router">{children}</div>
  ),
}));

jest.mock("react-dom/client", () => ({
  __esModule: true,
  default: {
    createRoot: (...args: unknown[]) => createRootMock(...args),
  },
  createRoot: (...args: unknown[]) => createRootMock(...args),
}));

describe("main.tsx", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test("bootstraps React using the #root element", () => {
    const rootEl = document.getElementById("root");

    createRootMock.mockReturnValue({
      render: renderMock,
    });

    jest.isolateModules(() => {
      require("../main");
    });

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  test("renders App inside ActivitiesProvider and HashRouter", async () => {
    const rootEl = document.getElementById("root");
    const actualReactDOMClient = jest.requireActual(
      "react-dom/client"
    ) as typeof import("react-dom/client");

    createRootMock.mockImplementation((container: Element | DocumentFragment) => {
      const realRoot = actualReactDOMClient.createRoot(container);
      return {
        render: (ui: React.ReactNode) => realRoot.render(ui),
        unmount: () => realRoot.unmount(),
      };
    });

    jest.isolateModules(() => {
      require("../main");
    });

    expect(rootEl).toBeTruthy();
    expect(await screen.findByTestId("activities-provider")).toBeInTheDocument();
    expect(await screen.findByTestId("hash-router")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-app")).toBeInTheDocument();
    expect(screen.getByText("App Loaded")).toBeInTheDocument();
  });

  test("renders the wrapper hierarchy in order", async () => {
    const actualReactDOMClient = jest.requireActual(
      "react-dom/client"
    ) as typeof import("react-dom/client");

    createRootMock.mockImplementation((container: Element | DocumentFragment) => {
      const realRoot = actualReactDOMClient.createRoot(container);
      return {
        render: (ui: React.ReactNode) => realRoot.render(ui),
        unmount: () => realRoot.unmount(),
      };
    });

    jest.isolateModules(() => {
      require("../main");
    });

    const provider = await screen.findByTestId("activities-provider");
    const router = await screen.findByTestId("hash-router");
    const app = await screen.findByTestId("mock-app");

    expect(provider).toContainElement(router);
    expect(router).toContainElement(app);
  });
});