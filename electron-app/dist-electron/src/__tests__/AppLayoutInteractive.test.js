"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
jest.mock("../components/TopBar", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { "data-testid": "topbar", children: "TopBar" }),
}));
jest.mock("../components/Sidebar", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { "data-testid": "sidebar", children: "Sidebar" }),
}));
const AppLayout_1 = __importDefault(require("../app/layouts/AppLayout"));
function renderWithOutlet(outletText = "Page Content") {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/"], future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(AppLayout_1.default, {}), children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)("div", { "data-testid": "page-content", children: outletText }) }) }) }) }));
}
describe("AppLayout interactive test", () => {
    test("renders shared layout elements", () => {
        renderWithOutlet();
        expect(react_1.screen.getByTestId("topbar")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("page-content")).toBeInTheDocument();
    });
    test("renders nested route content through Outlet", () => {
        renderWithOutlet("Dashboard Screen");
        expect(react_1.screen.getByText("Dashboard Screen")).toBeInTheDocument();
    });
    test("keeps wrapper hierarchy visible to the user", () => {
        renderWithOutlet();
        const sidebar = react_1.screen.getByTestId("sidebar");
        const topbar = react_1.screen.getByTestId("topbar");
        const content = react_1.screen.getByTestId("page-content");
        expect(sidebar).toBeVisible();
        expect(topbar).toBeVisible();
        expect(content).toBeVisible();
    });
});
