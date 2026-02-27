"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
function Sidebar() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const loc = (0, react_router_dom_1.useLocation)();
    const items = [
        { label: "Home", path: "/dashboard" },
        { label: "My Info", path: "/my-info" },
        { label: "Medications", path: "/medications" },
        { label: "Symptoms", path: "/symptoms" },
        { label: "My Health", path: "/my-health" },
        { label: "Exercises", path: "/exercises" },
        { label: "Activities" },
        { label: "Emergency" },
        { label: "Size Demo", path: "/size-demo" }
    ];
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "sidebar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "brand", children: [(0, jsx_runtime_1.jsx)("div", { className: "brandMark", children: "\u2661" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "brandTitle", children: "Care Connect" }), (0, jsx_runtime_1.jsx)("div", { className: "brandSub", children: "Your Health Companion" })] })] }), (0, jsx_runtime_1.jsx)("nav", { className: "nav", children: items.map((it) => {
                    const active = it.path ? loc.pathname === it.path : false;
                    return ((0, jsx_runtime_1.jsx)("button", { className: `navItem ${active ? "active" : ""}`, onClick: () => it.path && nav(it.path), disabled: !it.path, title: !it.path ? "Not implemented yet" : undefined, style: !it.path ? { opacity: 0.6, cursor: "not-allowed" } : undefined, children: it.label }, it.label));
                }) })] }));
}
