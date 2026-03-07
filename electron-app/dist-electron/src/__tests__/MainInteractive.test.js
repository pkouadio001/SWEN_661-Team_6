"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const renderMock = jest.fn();
const createRootMock = jest.fn();
jest.mock("../app/App", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { "data-testid": "mock-app", children: "App Loaded" }),
}));
jest.mock("../state/activitiesStore", () => ({
    __esModule: true,
    ActivitiesProvider: ({ children }) => ((0, jsx_runtime_1.jsx)("div", { "data-testid": "activities-provider", children: children })),
}));
jest.mock("react-router-dom", () => ({
    __esModule: true,
    HashRouter: ({ children }) => ((0, jsx_runtime_1.jsx)("div", { "data-testid": "hash-router", children: children })),
}));
jest.mock("react-dom/client", () => ({
    __esModule: true,
    default: {
        createRoot: (...args) => createRootMock(...args),
    },
    createRoot: (...args) => createRootMock(...args),
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
        const actualReactDOMClient = jest.requireActual("react-dom/client");
        createRootMock.mockImplementation((container) => {
            const realRoot = actualReactDOMClient.createRoot(container);
            return {
                render: (ui) => realRoot.render(ui),
                unmount: () => realRoot.unmount(),
            };
        });
        jest.isolateModules(() => {
            require("../main");
        });
        expect(rootEl).toBeTruthy();
        expect(await react_1.screen.findByTestId("activities-provider")).toBeInTheDocument();
        expect(await react_1.screen.findByTestId("hash-router")).toBeInTheDocument();
        expect(await react_1.screen.findByTestId("mock-app")).toBeInTheDocument();
        expect(react_1.screen.getByText("App Loaded")).toBeInTheDocument();
    });
    test("renders the wrapper hierarchy in order", async () => {
        const actualReactDOMClient = jest.requireActual("react-dom/client");
        createRootMock.mockImplementation((container) => {
            const realRoot = actualReactDOMClient.createRoot(container);
            return {
                render: (ui) => realRoot.render(ui),
                unmount: () => realRoot.unmount(),
            };
        });
        jest.isolateModules(() => {
            require("../main");
        });
        const provider = await react_1.screen.findByTestId("activities-provider");
        const router = await react_1.screen.findByTestId("hash-router");
        const app = await react_1.screen.findByTestId("mock-app");
        expect(provider).toContainElement(router);
        expect(router).toContainElement(app);
    });
});
