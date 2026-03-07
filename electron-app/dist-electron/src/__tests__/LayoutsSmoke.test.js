"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const AppLayout_1 = __importDefault(require("../app/layouts/AppLayout"));
describe("layouts smoke test", () => {
    test("AppLayout renders without crashing and shows nested content", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/"], future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(AppLayout_1.default, {}), children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)("div", { children: "Smoke Content" }) }) }) }) }));
        expect(react_1.screen.getByText("Smoke Content")).toBeInTheDocument();
    });
});
