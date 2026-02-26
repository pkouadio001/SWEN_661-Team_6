"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isSixDigits(pin) {
    return /^[0-9]{6}$/.test(pin);
}
function RegisterModal({ onClose }) {
    const [username, setUsername] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [pin, setPin] = (0, react_1.useState)("");
    const [confirm, setConfirm] = (0, react_1.useState)("");
    const [errors, setErrors] = (0, react_1.useState)({});
    function validate() {
        const next = {};
        if (!username.trim())
            next.username = "Username is required.";
        if (!email.trim())
            next.email = "Email is required.";
        else if (!isEmail(email.trim()))
            next.email = "Enter a valid email.";
        if (!pin.trim())
            next.pin = "PIN is required.";
        else if (!isSixDigits(pin.trim()))
            next.pin = "PIN must be 6 digits.";
        if (!confirm.trim())
            next.confirm = "Confirm your PIN.";
        else if (confirm.trim() !== pin.trim())
            next.confirm = "PINs do not match.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }
    function onCreate() {
        if (!validate())
            return;
        // demo behavior: close modal
        onClose();
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modalTitleRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "modalIcon", children: "+" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "modalTitle", children: "Register New Account" }), (0, jsx_runtime_1.jsx)("div", { className: "modalSubtitle", children: "Create your Care Connect account to get started." })] })] }), (0, jsx_runtime_1.jsx)("label", { className: "label", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.username ? "inputError" : ""}`, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Choose a username" }), errors.username && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.username }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.email ? "inputError" : ""}`, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your.email@example.com" }), errors.email && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.email }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Create PIN Number" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.pin ? "inputError" : ""}`, value: pin, onChange: (e) => setPin(e.target.value), placeholder: "Enter 6-digit PIN", type: "password", inputMode: "numeric" }), errors.pin && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.pin }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Confirm PIN Number" }), (0, jsx_runtime_1.jsx)("input", { className: `input ${errors.confirm ? "inputError" : ""}`, value: confirm, onChange: (e) => setConfirm(e.target.value), placeholder: "Re-enter 6-digit PIN", type: "password", inputMode: "numeric" }), errors.confirm && (0, jsx_runtime_1.jsx)("div", { className: "error", children: errors.confirm }), (0, jsx_runtime_1.jsxs)("div", { className: "modalActions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: onClose, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnSuccess", onClick: onCreate, children: "Create Account" })] })] }) }));
}
