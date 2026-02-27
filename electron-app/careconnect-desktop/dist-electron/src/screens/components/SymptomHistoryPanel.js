"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SymptomHistoryPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function fmt(ts) {
    const d = new Date(ts);
    const hh = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `Today at ${hh}`;
}
function fmtDate(ts) {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function severityChip(sev) {
    if (sev <= 2)
        return { text: "Mild", cls: "chip mild" };
    if (sev === 3)
        return { text: "Moderate", cls: "chip moderate" };
    return { text: "Severe", cls: "chip severe" };
}
function SymptomHistoryPanel({ logs, onDelete, onEdit }) {
    const [selectedDay, setSelectedDay] = (0, react_1.useState)(() => startOfDay(Date.now()));
    const filtered = (0, react_1.useMemo)(() => logs.filter((l) => startOfDay(l.createdAt) === selectedDay), [logs, selectedDay]);
    // simple mini calendar: just show current month dates (good enough for class demo)
    const monthDates = (0, react_1.useMemo)(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        const first = new Date(y, m, 1);
        const last = new Date(y, m + 1, 0);
        const days = [];
        for (let d = 1; d <= last.getDate(); d++) {
            const dt = new Date(y, m, d);
            dt.setHours(0, 0, 0, 0);
            days.push(dt.getTime());
        }
        return { y, m, days };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panelHeaderRow", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Symptom History" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Your recent symptom logs" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "historyBlock", children: [(0, jsx_runtime_1.jsx)("div", { className: "historyTitle", children: "Select Date" }), (0, jsx_runtime_1.jsxs)("div", { className: "calendarBox", children: [(0, jsx_runtime_1.jsx)("div", { className: "calendarHeader", children: (0, jsx_runtime_1.jsx)("span", { children: new Date(monthDates.y, monthDates.m, 1).toLocaleDateString(undefined, {
                                        month: "long",
                                        year: "numeric"
                                    }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "calendarGrid", children: monthDates.days.map((ts) => {
                                    const dayNum = new Date(ts).getDate();
                                    const active = ts === selectedDay;
                                    return ((0, jsx_runtime_1.jsx)("button", { className: `dayBtn ${active ? "active" : ""}`, onClick: () => setSelectedDay(ts), children: dayNum }, ts));
                                }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "selectedBanner purple", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "selectedTop", children: ["Selected: ", new Date(selectedDay).toLocaleDateString(undefined, { weekday: "long" }), ",", " ", new Date(selectedDay).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "selectedBottom", children: [filtered.length, " symptom logs found"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "historyTitle", style: { marginTop: 12 }, children: ["Symptoms on ", fmtDate(selectedDay)] }), (0, jsx_runtime_1.jsx)("div", { className: "historyList", children: filtered.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "muted", style: { padding: 12 }, children: "No logs for this date." })) : (filtered.map((l) => {
                            const chip = severityChip(l.severity);
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "historyItem", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyMain", children: [(0, jsx_runtime_1.jsx)("div", { className: "historyName", children: l.symptom }), (0, jsx_runtime_1.jsx)("div", { className: "historyTime", children: fmt(l.createdAt) }), l.notes ? (0, jsx_runtime_1.jsx)("div", { className: "historyNotes", children: l.notes }) : null] }), (0, jsx_runtime_1.jsxs)("div", { className: "historyActions", children: [(0, jsx_runtime_1.jsx)("span", { className: chip.cls, children: chip.text }), (0, jsx_runtime_1.jsx)("button", { className: "iconBtn", "aria-label": "Edit severity", onClick: () => {
                                                    const next = Math.min(5, l.severity + 1);
                                                    onEdit(l.id, { severity: next });
                                                }, title: "Increase severity", children: "\u270E" }), (0, jsx_runtime_1.jsx)("button", { className: "iconBtn danger", "aria-label": "Delete", onClick: () => onDelete(l.id), children: "\uD83D\uDDD1" })] })] }, l.id));
                        })) })] })] }));
}
