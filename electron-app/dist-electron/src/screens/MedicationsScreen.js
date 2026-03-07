"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MedicationsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const AddMedicationModal_1 = __importDefault(require("./components/AddMedicationModal"));
function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function MedicationsScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    // Demo data (matches your screenshot vibe)
    const [meds, setMeds] = (0, react_1.useState)([
        {
            id: uid(),
            name: "Carbidopa-Levodopa",
            dosage: "25-100mg",
            note: "Take with food",
            doses: [
                { id: uid(), timeLabel: "8:00 AM", status: "taken" },
                { id: uid(), timeLabel: "2:00 PM", status: "due" },
                { id: uid(), timeLabel: "8:00 PM", status: "upcoming" }
            ]
        },
        {
            id: uid(),
            name: "Amantadine",
            dosage: "100mg",
            note: "May cause dizziness",
            doses: [
                { id: uid(), timeLabel: "10:00 AM", status: "taken" },
                { id: uid(), timeLabel: "6:00 PM", status: "upcoming" }
            ]
        },
        {
            id: uid(),
            name: "Pramipexole",
            dosage: "0.25mg",
            note: "Take at same time daily",
            doses: [
                { id: uid(), timeLabel: "9:00 AM", status: "upcoming" },
                { id: uid(), timeLabel: "9:00 PM", status: "upcoming" }
            ]
        }
    ]);
    const subtitle = (0, react_1.useMemo)(() => "Keep track of your daily medications", []);
    function toggleTaken(medId, doseId) {
        setMeds((prev) => prev.map((m) => {
            if (m.id !== medId)
                return m;
            return {
                ...m,
                doses: m.doses.map((d) => {
                    if (d.id !== doseId)
                        return d;
                    // Toggle between taken and due (simple)
                    const next = d.status === "taken" ? "due" : "taken";
                    return { ...d, status: next };
                })
            };
        }));
    }
    function removeMedication(medId) {
        setMeds((prev) => prev.filter((m) => m.id !== medId));
    }
    function addMedication(input) {
        const times = input.times
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        const doses = times.length > 0
            ? times.map((t, idx) => ({
                id: uid(),
                timeLabel: t,
                status: idx === 0 ? "due" : "upcoming"
            }))
            : [{ id: uid(), timeLabel: "8:00 AM", status: "due" }];
        const next = {
            id: uid(),
            name: input.name.trim(),
            dosage: input.dosage.trim(),
            note: input.notes?.trim() || undefined,
            doses
        };
        setMeds((prev) => [next, ...prev]);
        setShowAdd(false);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "medHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "Medication Tracker" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: subtitle })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn medAddBtn", onClick: () => setShowAdd(true), children: "+\u00A0 Add Medication" })] }), (0, jsx_runtime_1.jsx)("div", { className: "medList", children: meds.map((m) => ((0, jsx_runtime_1.jsxs)("div", { className: "medCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "medCardTop", children: [(0, jsx_runtime_1.jsxs)("div", { className: "medTitleRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "medIcon", children: "\u270E" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "medName", children: m.name }), (0, jsx_runtime_1.jsx)("div", { className: "medDose", children: m.dosage })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "medActions", children: [(0, jsx_runtime_1.jsx)("button", { className: "iconBtn", title: "Edit (not implemented)", children: "\u270E" }), (0, jsx_runtime_1.jsx)("button", { className: "iconBtn danger", title: "Delete", onClick: () => removeMedication(m.id), children: "\uD83D\uDDD1" })] })] }), m.note && (0, jsx_runtime_1.jsxs)("div", { className: "medNote", children: ["\u24D8\u00A0 ", m.note] }), (0, jsx_runtime_1.jsx)("div", { className: "doseList", children: m.doses.map((d) => ((0, jsx_runtime_1.jsxs)("div", { className: `doseRow ${d.status}`, children: [(0, jsx_runtime_1.jsxs)("label", { className: "doseLeft", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: d.status === "taken", onChange: () => toggleTaken(m.id, d.id) }), (0, jsx_runtime_1.jsxs)("span", { className: "doseTime", children: ["\uD83D\uDD52\u00A0 ", d.timeLabel] })] }), (0, jsx_runtime_1.jsxs)("div", { className: `doseStatus ${d.status}`, children: [d.status === "taken" && "✓ Taken", d.status === "due" && "⏱ Due Now", d.status === "missed" && "⛔ Missed", d.status === "upcoming" && ""] })] }, d.id))) })] }, m.id))) })] })] }), showAdd && (0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: () => setShowAdd(false), onAdd: addMedication })] }));
}
