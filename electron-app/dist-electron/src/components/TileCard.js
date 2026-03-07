"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TileCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function TileCard({ icon, title, subtitle, color, span = 1 }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "tile", style: { gridColumn: `span ${span}` }, children: [(0, jsx_runtime_1.jsx)("div", { className: `tileIcon ${color}`, children: icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "tileTitle", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "tileSub", children: subtitle })] })] }));
}
