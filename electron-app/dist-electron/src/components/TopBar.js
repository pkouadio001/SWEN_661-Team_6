"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopBar;
const jsx_runtime_1 = require("react/jsx-runtime");
function TopBar({ onLogout, onQuit }) {
    return ((0, jsx_runtime_1.jsx)("header", { className: "topbar", children: (0, jsx_runtime_1.jsxs)("div", { className: "topActions", children: [(0, jsx_runtime_1.jsx)("button", { className: "chip", children: "Colors / High Contrast" }), (0, jsx_runtime_1.jsx)("button", { className: "chip", children: "Text & Button Size" }), (0, jsx_runtime_1.jsx)("button", { className: "chip", children: "Print Preview" }), (0, jsx_runtime_1.jsx)("button", { className: "chip", onClick: onLogout, children: "Logout" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnDanger", onClick: onQuit, children: "\u2715 Quit" })] }) }));
}
