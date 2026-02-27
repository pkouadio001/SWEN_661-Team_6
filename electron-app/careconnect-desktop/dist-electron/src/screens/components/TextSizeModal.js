"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextSizeModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const uiScale_1 = require("../../state/uiScale");
const options = [
    { key: "small", title: "Small (90% page scale)", desc: "Compact text, buttons, and page" },
    { key: "medium", title: "Medium (100% - Default)", desc: "Balanced text, buttons, and page" },
    { key: "large", title: "Large (110% page scale)", desc: "Large text, buttons, and page" }
];
function TextSizeModal({ onClose }) {
    const { scale, setScale } = (0, uiScale_1.useUiScale)();
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", onMouseDown: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "sizeModal", onMouseDown: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "sizeModalHeader", children: [(0, jsx_runtime_1.jsx)("div", { className: "sizeModalTitle", children: "Adjust All Interface Elements" }), (0, jsx_runtime_1.jsx)("button", { className: "xBtn", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { className: "sizeModalList", children: options.map((o) => ((0, jsx_runtime_1.jsx)("button", { className: `sizeOption ${scale === o.key ? "active" : ""}`, onClick: () => setScale(o.key), type: "button", children: (0, jsx_runtime_1.jsxs)("div", { className: "sizeOptionText", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sizeOptionTitle", children: [o.title, scale === o.key && (0, jsx_runtime_1.jsx)("span", { className: "sizeCheck", children: "\u2713" })] }), (0, jsx_runtime_1.jsx)("div", { className: "sizeOptionDesc", children: o.desc })] }) }, o.key))) }), (0, jsx_runtime_1.jsxs)("div", { className: "sizeModalHint", children: ["Tip: You can also change this from the ", (0, jsx_runtime_1.jsx)("strong", { children: "Size Demo" }), " screen."] })] }) }));
}
