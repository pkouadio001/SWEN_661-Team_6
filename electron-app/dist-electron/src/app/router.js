"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const react_1 = require("react");
//import AppLayout from "../app/layouts/AppLayout";
const LoginScreen_1 = __importDefault(require("../screens/LoginScreen"));
const DashboardScreen_1 = __importDefault(require("../screens/DashboardScreen"));
const MyHealthScreen_1 = __importDefault(require("../screens/MyHealthScreen"));
const MedicationsScreen_1 = __importDefault(require("../screens/MedicationsScreen"));
const SizeDemoScreen_1 = __importDefault(require("../screens/SizeDemoScreen"));
const ExercisesScreen_1 = __importDefault(require("../screens/ExercisesScreen"));
const MyInfoScreen_1 = __importDefault(require("../screens/MyInfoScreen"));
const SymptomsScreen_1 = __importDefault(require("../screens/SymptomsScreen"));
const EmergencyScreen_1 = __importDefault(require("../screens/EmergencyScreen"));
const ActivitiesScreen_1 = __importDefault(require("../screens/ActivitiesScreen"));
const AUTH_KEY = "careconnect.authenticated";
function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === "true";
}
function Router() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(() => {
        const off = window.careconnect.onNavigate((route) => {
            if (route === "/login") {
                localStorage.removeItem(AUTH_KEY);
                navigate("/login");
                return;
            }
            if (route === "/dashboard" && !isAuthenticated()) {
                navigate("/login");
                return;
            }
            navigate(route);
        });
        return () => off();
    }, [navigate]);
    (0, react_1.useEffect)(() => {
        function onKeyDown(event) {
            if (event.defaultPrevented)
                return;
            if (event.key === "Enter") {
                const active = document.activeElement;
                if (!active)
                    return;
                const roleCheckbox = active.getAttribute("role") === "checkbox"
                    ? active
                    : active.closest("[role='checkbox']");
                if (roleCheckbox instanceof HTMLElement) {
                    event.preventDefault();
                    roleCheckbox.click();
                    return;
                }
                const checkbox = active instanceof HTMLInputElement && active.type === "checkbox"
                    ? active
                    : active.closest("label")?.querySelector("input[type='checkbox']") ??
                        active.querySelector("input[type='checkbox']");
                if (checkbox instanceof HTMLInputElement) {
                    event.preventDefault();
                    checkbox.click();
                }
                return;
            }
            if (event.key !== "Escape")
                return;
            if (location.pathname === "/dashboard" || location.pathname === "/login")
                return;
            if (!isAuthenticated()) {
                navigate("/login");
                return;
            }
            navigate("/dashboard");
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [location.pathname, navigate]);
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(LoginScreen_1.default, {}) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(DashboardScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/my-health", element: (0, jsx_runtime_1.jsx)(MyHealthScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/medications", element: (0, jsx_runtime_1.jsx)(MedicationsScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/size-demo", element: (0, jsx_runtime_1.jsx)(SizeDemoScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/exercises", element: (0, jsx_runtime_1.jsx)(ExercisesScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/my-info", element: (0, jsx_runtime_1.jsx)(MyInfoScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/symptoms", element: (0, jsx_runtime_1.jsx)(SymptomsScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/activities", element: (0, jsx_runtime_1.jsx)(ActivitiesScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/emergency", element: (0, jsx_runtime_1.jsx)(EmergencyScreen_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true }) })] }));
}
