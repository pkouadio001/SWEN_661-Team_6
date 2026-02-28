"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivitiesScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const AddActivityModal_1 = __importDefault(require("./components/AddActivityModal"));
const activitiesStore_1 = require("../state/activitiesStore");
function ActivitiesScreen() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { activities, toggleActivity } = (0, activitiesStore_1.useActivities)();
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const completed = activities.filter(a => a.completed).length;
    const total = activities.length;
    const progress = total === 0 ? 0 : (completed / total) * 100;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => navigate("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pageHead", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "Daily Activities" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Track your daily routine and tasks" })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => setShowAdd(true), children: "+ Add Activity" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Today's Progress" }), (0, jsx_runtime_1.jsx)("div", { className: "progressBar", children: (0, jsx_runtime_1.jsx)("div", { className: "progressFill", style: { width: `${progress}%` } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "muted", children: [completed, " / ", total, " completed"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Today's Schedule" }), activities.map((activity) => ((0, jsx_runtime_1.jsxs)("div", { className: `activityRow ${activity.completed ? "done" : ""}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "activityLeft", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: activity.completed, onChange: () => toggleActivity(activity.id) }), (0, jsx_runtime_1.jsx)("span", { children: activity.title })] }), activity.time && ((0, jsx_runtime_1.jsxs)("div", { className: "muted", children: ["\uD83D\uDD52 ", activity.time] }))] }, activity.id)))] })] })] }), showAdd && (0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: () => setShowAdd(false) })] }));
}
