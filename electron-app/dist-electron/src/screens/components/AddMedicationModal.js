"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddMedicationModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function AddMedicationModal({ onClose, onAdd }) {
    const [name, setName] = (0, react_1.useState)("");
    const [dosage, setDosage] = (0, react_1.useState)("");
    const [times, setTimes] = (0, react_1.useState)("");
    const [notes, setNotes] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)(null);
    function submit() {
        setError(null);
        if (!name.trim())
            return setError("Medication name is required.");
        if (!dosage.trim())
            return setError("Dosage is required.");
        if (!times.trim())
            return setError("At least one time is required (comma separated).");
        onAdd({
            name,
            dosage,
            times,
            notes: notes.trim() || undefined
        });
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", onMouseDown: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "addMedModal", onMouseDown: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "logModalHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "logModalTitle", children: "Add New Medication" }), (0, jsx_runtime_1.jsx)("div", { className: "logModalSub", children: "Enter your medication details below" })] }), (0, jsx_runtime_1.jsx)("button", { className: "xBtn", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Medication Name" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g., Carbidopa-Levodopa" }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Dosage" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: dosage, onChange: (e) => setDosage(e.target.value), placeholder: "e.g., 25-100mg" }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Times (comma separated)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: times, onChange: (e) => setTimes(e.target.value), placeholder: "e.g., 8:00 AM, 2:00 PM" }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Notes (optional)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "e.g., Take with food" }), error && (0, jsx_runtime_1.jsx)("div", { className: "error", style: { marginTop: 8 }, children: error }), (0, jsx_runtime_1.jsx)("button", { className: "btn addMedBtn", onClick: submit, children: "Add Medication" })] }) }));
}
