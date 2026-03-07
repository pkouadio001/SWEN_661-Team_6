"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Panel;
const jsx_runtime_1 = require("react/jsx-runtime");
function Panel({ title, items, buttonText, buttonVariant }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "panelList", children: items.map((it) => ((0, jsx_runtime_1.jsxs)("div", { className: "panelRow", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelMain", children: it.leftTitle }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: it.leftSub })] }), (0, jsx_runtime_1.jsx)("div", { className: "panelRight", children: it.right })] }, it.leftTitle))) }), (0, jsx_runtime_1.jsx)("button", { className: `btn ${buttonVariant === "primary" ? "btnPrimary" : "btnSuccess"} panelBtn`, children: buttonText })] }));
}
