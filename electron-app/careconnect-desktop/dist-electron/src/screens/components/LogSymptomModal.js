"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogSymptomModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const symptomOptions = [
    "Tremor - Right Hand",
    "Tremor - Left Hand",
    "Stiffness",
    "Balance Issues",
    "Fatigue",
    "Slowness of Movement"
];
function severityLabel(v) {
    if (v <= 2)
        return "Mild";
    if (v === 3)
        return "Moderate";
    return "Severe";
}
function LogSymptomModal({ onClose, onSave }) {
    const [symptom, setSymptom] = (0, react_1.useState)("Tremor - Right Hand");
    const [severity, setSeverity] = (0, react_1.useState)(3);
    const [notes, setNotes] = (0, react_1.useState)("");
    const sevText = (0, react_1.useMemo)(() => `Severity: ${severityLabel(severity)} (${severity}/5)`, [severity]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", role: "dialog", "aria-modal": "true", "aria-label": "Log New Symptom", children: (0, jsx_runtime_1.jsxs)("div", { className: "modalCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modalHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "modalTitle", children: "Log New Symptom" }), (0, jsx_runtime_1.jsx)("div", { className: "modalSub", children: "Record how you\u2019re feeling right now" })] }), (0, jsx_runtime_1.jsx)("button", { className: "iconBtn", onClick: onClose, "aria-label": "Close", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modalBody", children: [(0, jsx_runtime_1.jsx)("div", { className: "modalSectionTitle", children: "Select Symptom" }), (0, jsx_runtime_1.jsx)("div", { className: "chipGrid", children: symptomOptions.map((s) => ((0, jsx_runtime_1.jsx)("button", { className: `selectChip ${s === symptom ? "active" : ""}`, onClick: () => setSymptom(s), children: s }, s))) }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "modalSectionTitle", children: sevText }), (0, jsx_runtime_1.jsxs)("div", { className: "sliderRow", children: [(0, jsx_runtime_1.jsx)("span", { className: "muted", children: "Very Mild" }), (0, jsx_runtime_1.jsx)("input", { className: "slider", type: "range", min: 1, max: 5, value: severity, onChange: (e) => setSeverity(Number(e.target.value)), "aria-label": "Severity" }), (0, jsx_runtime_1.jsx)("span", { className: "muted", children: "Severe" })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "modalSectionTitle", children: "Additional Notes (optional)" }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: notes, placeholder: "Any additional details...", onChange: (e) => setNotes(e.target.value), rows: 4 })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "modalFooter", children: (0, jsx_runtime_1.jsx)("button", { className: "btn full muted", onClick: () => onSave({
                            symptom,
                            severity,
                            notes: notes.trim() ? notes.trim() : undefined
                        }), children: "Save Symptom Log" }) })] }) }));
}
