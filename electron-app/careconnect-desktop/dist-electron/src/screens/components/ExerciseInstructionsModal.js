"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExerciseInstructionsModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function ExerciseInstructionsModal({ exercise, onClose, onStart }) {
    // ESC closes
    (0, react_1.useEffect)(() => {
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "modalOverlay", onMouseDown: onClose, role: "dialog", "aria-modal": "true", children: (0, jsx_runtime_1.jsxs)("div", { className: "exerciseModal", onMouseDown: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "exerciseModalHeader", children: [(0, jsx_runtime_1.jsxs)("div", { className: "exerciseModalTitleRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "exerciseModalIcon", children: "\uD83C\uDFC3" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "exerciseModalTitle", children: exercise.title }), (0, jsx_runtime_1.jsx)("div", { className: "exerciseModalSub", children: "Follow these instructions carefully to perform the exercise safely and effectively." })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "xBtn", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseMetaRow", children: [(0, jsx_runtime_1.jsxs)("span", { className: "pill neutral", children: ["\uD83D\uDD52 ", exercise.durationMin, " min"] }), (0, jsx_runtime_1.jsx)("span", { className: `pill ${exercise.difficulty.toLowerCase()}`, children: exercise.difficulty })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseSection infoBox", children: [(0, jsx_runtime_1.jsx)("div", { className: "sectionTitle", children: "Overview" }), (0, jsx_runtime_1.jsx)("div", { className: "sectionText", children: exercise.overview })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseSection", children: [(0, jsx_runtime_1.jsx)("div", { className: "sectionTitle", children: "Step-by-Step Instructions" }), (0, jsx_runtime_1.jsx)("ol", { className: "stepsList", children: exercise.steps.map((s, i) => ((0, jsx_runtime_1.jsxs)("li", { className: "stepItem", children: [(0, jsx_runtime_1.jsx)("span", { className: "stepNum", children: i + 1 }), (0, jsx_runtime_1.jsx)("span", { children: s })] }, i))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseSection safetyBox", children: [(0, jsx_runtime_1.jsx)("div", { className: "sectionTitle", children: "\u26A0 Safety Reminders" }), (0, jsx_runtime_1.jsx)("ul", { className: "safetyList", children: exercise.safety.map((s, i) => ((0, jsx_runtime_1.jsx)("li", { children: s }, i))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseModalFooter", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: onClose, children: "Close" }), (0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => onStart(exercise.id), children: "\u25B6 Start Exercise" })] })] }) }));
}
