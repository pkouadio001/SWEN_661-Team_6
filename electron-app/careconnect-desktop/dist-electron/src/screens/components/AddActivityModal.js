"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddActivityModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const activitiesStore_1 = require("../../state/activitiesStore");
function getFocusable(container) {
    if (!container)
        return [];
    const nodes = container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    return Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}
function AddActivityModal({ onClose }) {
    const { addActivity } = (0, activitiesStore_1.useActivities)();
    const [title, setTitle] = (0, react_1.useState)("");
    const [time, setTime] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)(null);
    const dialogRef = (0, react_1.useRef)(null);
    const titleRef = (0, react_1.useRef)(null);
    const canSubmit = (0, react_1.useMemo)(() => title.trim().length > 0, [title]);
    (0, react_1.useEffect)(() => {
        titleRef.current?.focus();
    }, []);
    (0, react_1.useEffect)(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            // Basic focus trap
            if (e.key === "Tab") {
                const focusables = getFocusable(dialogRef.current);
                if (focusables.length === 0)
                    return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement;
                if (!active)
                    return;
                if (e.shiftKey) {
                    if (active === first) {
                        e.preventDefault();
                        last.focus();
                    }
                }
                else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);
    function submit() {
        const t = title.trim();
        if (!t) {
            setError("Activity title is required.");
            titleRef.current?.focus();
            return;
        }
        addActivity(t, time.trim() || undefined);
        onClose();
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", role: "presentation", onMouseDown: (e) => {
            // click outside closes
            if (e.target === e.currentTarget)
                onClose();
        }, children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "add-activity-title", ref: dialogRef, children: [(0, jsx_runtime_1.jsxs)("div", { className: "modalHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { id: "add-activity-title", className: "modalTitle", children: "Add New Activity" }), (0, jsx_runtime_1.jsx)("p", { className: "modalSubtitle", children: "Add a task or reminder to your daily schedule" })] }), (0, jsx_runtime_1.jsx)("button", { className: "iconBtn", onClick: onClose, "aria-label": "Close dialog", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modalBody", children: [(0, jsx_runtime_1.jsx)("label", { className: "fieldLabel", htmlFor: "activityTitle", children: "Activity Title" }), (0, jsx_runtime_1.jsx)("input", { id: "activityTitle", ref: titleRef, className: "textInput", placeholder: "e.g., Take a walk", value: title, onChange: (e) => {
                                setTitle(e.target.value);
                                setError(null);
                            } }), (0, jsx_runtime_1.jsx)("label", { className: "fieldLabel", htmlFor: "activityTime", children: "Time (optional)" }), (0, jsx_runtime_1.jsx)("input", { id: "activityTime", className: "textInput", placeholder: "e.g., 3:00 PM", value: time, onChange: (e) => setTime(e.target.value) }), error && ((0, jsx_runtime_1.jsx)("div", { className: "formError", role: "alert", children: error }))] }), (0, jsx_runtime_1.jsx)("div", { className: "modalFooter", children: (0, jsx_runtime_1.jsx)("button", { className: "btn primary wide", onClick: submit, disabled: !canSubmit, "aria-disabled": !canSubmit, children: "Add Activity" }) })] }) }));
}
