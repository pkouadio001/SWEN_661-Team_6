"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogHealthDataModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function moodLabel(level) {
    // level 1..5
    if (level <= 1)
        return "Very Low";
    if (level === 2)
        return "Low";
    if (level === 3)
        return "Moderate";
    if (level === 4)
        return "Good";
    return "Excellent";
}
function LogHealthDataModal({ onClose, onSave }) {
    const [tab, setTab] = (0, react_1.useState)("bloodPressure");
    // Blood Pressure
    const [systolic, setSystolic] = (0, react_1.useState)("120");
    const [diastolic, setDiastolic] = (0, react_1.useState)("80");
    const [pulse, setPulse] = (0, react_1.useState)("70");
    // Mood
    const feelings = (0, react_1.useMemo)(() => ["Happy", "Calm", "Anxious", "Energetic", "Tired", "Content"], []);
    const [feeling, setFeeling] = (0, react_1.useState)("Happy");
    const [moodLevel, setMoodLevel] = (0, react_1.useState)(3); // 1..5
    // Meal
    const [mealType, setMealType] = (0, react_1.useState)("Breakfast");
    const [mealDesc, setMealDesc] = (0, react_1.useState)("");
    const [calories, setCalories] = (0, react_1.useState)("");
    // Shared
    const [notes, setNotes] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)(null);
    function parseIntSafe(v) {
        const n = Number.parseInt(v, 10);
        return Number.isFinite(n) ? n : null;
    }
    function validateAndSave() {
        setError(null);
        if (tab === "bloodPressure") {
            const s = parseIntSafe(systolic);
            const d = parseIntSafe(diastolic);
            const p = pulse.trim() ? parseIntSafe(pulse) : null;
            if (s === null || s < 50 || s > 250)
                return setError("Enter a valid systolic value.");
            if (d === null || d < 30 || d > 160)
                return setError("Enter a valid diastolic value.");
            if (p !== null && (p < 30 || p > 220))
                return setError("Enter a valid pulse value (or leave blank).");
            onSave({
                type: "bloodPressure",
                systolic: s,
                diastolic: d,
                pulse: p ?? undefined,
                notes: notes.trim() || undefined
            });
            return;
        }
        if (tab === "mood") {
            const lvl = clamp(moodLevel, 1, 5);
            onSave({
                type: "mood",
                feeling,
                moodLevel: lvl,
                notes: notes.trim() || undefined
            });
            return;
        }
        // meal
        if (!mealDesc.trim())
            return setError("Please describe what you ate.");
        const c = calories.trim() ? parseIntSafe(calories) : null;
        if (c !== null && (c < 0 || c > 10000))
            return setError("Enter a valid calories number (or leave blank).");
        onSave({
            type: "meal",
            mealType,
            description: mealDesc.trim(),
            calories: c ?? undefined,
            notes: notes.trim() || undefined
        });
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", onMouseDown: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "logModalV2", onMouseDown: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "logModalHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "logModalTitle", children: "Log Health Data" }), (0, jsx_runtime_1.jsx)("div", { className: "logModalSub", children: "Record your health information" })] }), (0, jsx_runtime_1.jsx)("button", { className: "xBtn", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { className: "logSectionTitle", children: "What would you like to log?" }), (0, jsx_runtime_1.jsxs)("div", { className: "logTabsV2", children: [(0, jsx_runtime_1.jsxs)("button", { className: `logTab ${tab === "bloodPressure" ? "active" : ""}`, onClick: () => setTab("bloodPressure"), children: ["\u2661 ", (0, jsx_runtime_1.jsx)("div", { children: "Blood Pressure" })] }), (0, jsx_runtime_1.jsxs)("button", { className: `logTab ${tab === "mood" ? "active" : ""}`, onClick: () => setTab("mood"), children: ["\u25C9 ", (0, jsx_runtime_1.jsx)("div", { children: "Mood" })] }), (0, jsx_runtime_1.jsxs)("button", { className: `logTab ${tab === "meal" ? "active" : ""}`, onClick: () => setTab("meal"), children: ["\uD83C\uDF4F ", (0, jsx_runtime_1.jsx)("div", { children: "Meal" })] })] }), tab === "bloodPressure" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "twoCol", style: { marginTop: 10 }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: "Systolic (top)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: systolic, onChange: (e) => setSystolic(e.target.value), inputMode: "numeric" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "label", children: "Diastolic (bottom)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: diastolic, onChange: (e) => setDiastolic(e.target.value), inputMode: "numeric" })] })] }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Pulse (optional)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: pulse, onChange: (e) => setPulse(e.target.value), inputMode: "numeric" }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Additional Notes (optional)" }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Any additional details..." })] })), tab === "mood" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "logSectionTitle", style: { marginTop: 10 }, children: "How are you feeling?" }), (0, jsx_runtime_1.jsx)("div", { className: "feelingGrid", children: feelings.map((f) => ((0, jsx_runtime_1.jsx)("button", { type: "button", className: `feelingBtn ${feeling === f ? "active" : ""}`, onClick: () => setFeeling(f), children: f }, f))) }), (0, jsx_runtime_1.jsx)("div", { className: "moodSliderHeader", children: (0, jsx_runtime_1.jsxs)("div", { className: "moodSliderLabel", children: ["Mood Level: ", (0, jsx_runtime_1.jsxs)("strong", { children: [moodLabel(moodLevel), " (", moodLevel, "/5)"] })] }) }), (0, jsx_runtime_1.jsx)("input", { className: "moodSlider", type: "range", min: 1, max: 5, step: 1, value: moodLevel, onChange: (e) => setMoodLevel(Number(e.target.value)) }), (0, jsx_runtime_1.jsxs)("div", { className: "moodScale", children: [(0, jsx_runtime_1.jsx)("span", { children: "Very Low" }), (0, jsx_runtime_1.jsx)("span", { children: "Excellent" })] }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Additional Notes (optional)" }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Any additional details..." })] })), tab === "meal" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Meal Type" }), (0, jsx_runtime_1.jsx)("div", { className: "mealGrid", children: ["Breakfast", "Lunch", "Dinner", "Snack"].map((t) => ((0, jsx_runtime_1.jsx)("button", { type: "button", className: `mealBtn ${mealType === t ? "active" : ""}`, onClick: () => setMealType(t), children: t }, t))) }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "What did you eat?" }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: mealDesc, onChange: (e) => setMealDesc(e.target.value), placeholder: "Describe your meal..." }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Calories (optional)" }), (0, jsx_runtime_1.jsx)("input", { className: "input", value: calories, onChange: (e) => setCalories(e.target.value), inputMode: "numeric", placeholder: "Enter calories..." }), (0, jsx_runtime_1.jsx)("label", { className: "label", style: { marginTop: 10 }, children: "Additional Notes (optional)" }), (0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Any additional details..." })] })), error && (0, jsx_runtime_1.jsx)("div", { className: "error", style: { marginTop: 8 }, children: error }), (0, jsx_runtime_1.jsx)("button", { className: "btn logSaveBtn", onClick: validateAndSave, children: "Save Health Log" })] }) }));
}
