"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../../components/Sidebar"));
const TopBar_1 = __importDefault(require("../../components/TopBar"));
function AppLayout() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => { }, onQuit: () => window.careconnect.quitApp?.() }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {})] })] }));
}
