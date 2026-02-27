"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const RegisterModal_1 = __importDefault(require("../screens/components/RegisterModal"));
function isSixDigits(pin) {
    return /^[0-9]{6}$/.test(pin);
}
function LoginScreen() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [username, setUsername] = (0, react_1.useState)("");
    const [pin, setPin] = (0, react_1.useState)("");
    const [errors, setErrors] = (0, react_1.useState)({});
    const [showRegister, setShowRegister] = (0, react_1.useState)(false);
    const todayText = (0, react_1.useMemo)(() => {
        const d = new Date();
        return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }, []);
    function validate() {
        const next = {};
        if (!username.trim())
            next.username = "Username is required.";
        if (!pin.trim())
            next.pin = "PIN is required.";
        else if (!isSixDigits(pin.trim()))
            next.pin = "PIN must be exactly 6 digits.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }
    function onSubmit(e) {
        e.preventDefault();
        if (!validate())
            return;
        navigate("/dashboard", { state: { username: username.trim() } });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg", children: [(0, jsx_runtime_1.jsx)("div", { className: "topRight", children: (0, jsx_runtime_1.jsx)("button", { className: "btn btnDanger", onClick: () => window.careconnect.quitApp(), children: "\u2715 Quit" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "centerCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "logoCircle", children: "\u2661" }), (0, jsx_runtime_1.jsx)("h1", { className: "title", children: "Care Connect" }), (0, jsx_runtime_1.jsx)("div", { className: "subtitle", children: "Your Personal Health Companion" }), (0, jsx_runtime_1.jsxs)("form", { className: "form", onSubmit: onSubmit, children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.username ? "inputError" : ""}`, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter your username" }), (0, jsx_runtime_1.jsx)("div", { className: "hint", children: "Username is not case sensitive" }), errors.username && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.username }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 14 }, children: "PIN Number" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.pin ? "inputError" : ""}`, value: pin, onChange: (e) => setPin(e.target.value), placeholder: "Enter 6-digit PIN", inputMode: "numeric", type: "password" }), (0, jsx_runtime_1.jsx)("div", { className: "hint", children: "Enter your 6 digit PIN number" }), errors.pin && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.pin }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnPrimary", type: "submit", style: { marginTop: 14 }, children: "Sign In" }), (0, jsx_runtime_1.jsxs)("div", { className: "links", children: [(0, jsx_runtime_1.jsx)("span", { children: "Forgot your username or PIN? " }), (0, jsx_runtime_1.jsx)("a", { href: "#", children: "Recover credentials" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "links", children: [(0, jsx_runtime_1.jsx)("span", { children: "Don't have an account? " }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "linkBtn", onClick: () => setShowRegister(true), children: "Register Now" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "infoBox", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Welcome to Care Connect" }), (0, jsx_runtime_1.jsx)("div", { children: "Manage your medications, track symptoms, and stay connected with your care team." }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 8, fontSize: 12, opacity: 0.8 }, children: ["Today: ", todayText] })] })] })] }), showRegister && ((0, jsx_runtime_1.jsx)(RegisterModal_1.default, { onClose: () => setShowRegister(false) }))] }));
}
