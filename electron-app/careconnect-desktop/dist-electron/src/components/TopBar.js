"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TextSizeModal_1 = __importDefault(require("../screens/components/TextSizeModal"));
function TopBar({ onLogout, onQuit }) {
    const [showSizeModal, setShowSizeModal] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("header", { className: "topbar", children: (0, jsx_runtime_1.jsxs)("div", { className: "topActions", children: [(0, jsx_runtime_1.jsx)("button", { className: "chip", children: "Colors / High Contrast" }), (0, jsx_runtime_1.jsx)("button", { className: "topBtn", onClick: () => setShowSizeModal(true), children: "Text & Button Size" }), (0, jsx_runtime_1.jsx)("button", { className: "chip", children: "Print Preview" }), (0, jsx_runtime_1.jsx)("button", { className: "chip", onClick: onLogout, children: "Logout" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnDanger", onClick: onQuit, children: "\u2715 Quit" })] }) }), showSizeModal && ((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: () => setShowSizeModal(false) }))] }));
}
