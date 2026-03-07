"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const TileCard_1 = __importDefault(require("../components/TileCard"));
const Panel_1 = __importDefault(require("../components/Panel"));
function DashboardScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const username = location.state?.username ?? "pemson";
    const now = new Date();
    const day = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "welcomeRow", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "welcomeTitle", children: ["Welcome Back, ", username, "!"] }), (0, jsx_runtime_1.jsx)("div", { className: "welcomeSub", children: day })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeBig", children: time })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tiles", children: [(0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: "\u270E", title: "Medications", subtitle: "Track your daily medications", color: "blue" }), (0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: "\u223F", title: "Log Symptoms", subtitle: "Record how you're feeling", color: "purple" }), (0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: "\u2661", title: "My Health", subtitle: "Track blood pressure, mood & meals", color: "pink" }), (0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: "\u27E1", title: "Exercises", subtitle: "View your exercise plan", color: "green" })] }), (0, jsx_runtime_1.jsx)("div", { className: "tiles", style: { gridTemplateColumns: "repeat(4, 1fr)" }, children: (0, jsx_runtime_1.jsx)(TileCard_1.default, { icon: "\u260E", title: "Emergency", subtitle: "Quick access to contacts", color: "red", span: 2 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "panels", children: [(0, jsx_runtime_1.jsx)(Panel_1.default, { title: "Upcoming Medications", buttonText: "View All Medications", buttonVariant: "primary", items: [
                                            { leftTitle: "Carbidopa-Levodopa", leftSub: "25-100mg", right: "2:00 PM" },
                                            { leftTitle: "Amantadine", leftSub: "100mg", right: "6:00 PM" }
                                        ] }), (0, jsx_runtime_1.jsx)(Panel_1.default, { title: "Today's Exercises", buttonText: "View Exercise Plan", buttonVariant: "success", items: [
                                            { leftTitle: "Stretching Routine", leftSub: "15 min", right: "3:00 PM" },
                                            { leftTitle: "Walking", leftSub: "20 min", right: "5:00 PM" }
                                        ] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "banner", children: [(0, jsx_runtime_1.jsx)("div", { className: "bannerIcon", children: "\u2661" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "bannerTitle", children: "Remember to stay hydrated!" }), (0, jsx_runtime_1.jsx)("div", { className: "bannerSub", children: "Drink water regularly throughout the day." })] })] })] })] })] }));
}
