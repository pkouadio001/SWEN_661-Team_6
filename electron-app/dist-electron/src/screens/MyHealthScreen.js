"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyHealthScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/screens/MyHealthScreen.tsx
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const HealthTrendsChart_1 = __importDefault(require("./components/HealthTrendsChart"));
const LogHealthDataModal_1 = __importDefault(require("./components/LogHealthDataModal"));
function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function sameDay(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
function fmtSelected(d) {
    return d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
function fmtShort(d) {
    return d.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
}
function fmtTime(d) {
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function bpStage(s, d) {
    // simple label (good enough for demo UI)
    if (s >= 140 || d >= 90)
        return "High Stage 2";
    if (s >= 130 || d >= 80)
        return "High Stage 1";
    if (s >= 120 && d < 80)
        return "Elevated";
    return "Normal";
}
function MyHealthScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const [showLog, setShowLog] = (0, react_1.useState)(false);
    const [showHistory, setShowHistory] = (0, react_1.useState)(false);
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(startOfDay(new Date()));
    const [calMonth, setCalMonth] = (0, react_1.useState)(() => {
        const d = new Date();
        d.setDate(1);
        return startOfDay(d);
    });
    // Demo seed data (feel free to tweak)
    const [logs, setLogs] = (0, react_1.useState)([
        {
            id: uid(),
            type: "bloodPressure",
            createdAt: new Date().toISOString(),
            systolic: 125,
            diastolic: 82,
            pulse: 70
        },
        {
            id: uid(),
            type: "mood",
            createdAt: new Date().toISOString(),
            feeling: "Happy",
            moodLevel: 3
        },
        {
            id: uid(),
            type: "meal",
            createdAt: new Date().toISOString(),
            mealType: "Lunch",
            description: "Sandwich + fruit",
            calories: 450
        }
    ]);
    const latestBp = (0, react_1.useMemo)(() => {
        const bp = logs.find((l) => l.type === "bloodPressure");
        if (!bp?.systolic || !bp?.diastolic)
            return "—";
        return `${bp.systolic}/${bp.diastolic}`;
    }, [logs]);
    const todaysMood = (0, react_1.useMemo)(() => {
        const m = logs.find((l) => l.type === "mood");
        if (!m)
            return "—";
        return m.feeling ?? "—";
    }, [logs]);
    const mealsToday = (0, react_1.useMemo)(() => {
        // simple demo: count meal logs (assume all are today, or you can filter by date)
        return logs.filter((l) => l.type === "meal").length;
    }, [logs]);
    const logsForSelectedDate = (0, react_1.useMemo)(() => {
        return logs.filter((l) => sameDay(new Date(l.createdAt), selectedDate));
    }, [logs, selectedDate]);
    function addLog(input) {
        const base = {
            id: uid(),
            type: input.type,
            createdAt: new Date().toISOString(),
            notes: input.notes?.trim() || undefined
        };
        if (input.type === "bloodPressure") {
            const next = {
                ...base,
                systolic: input.systolic,
                diastolic: input.diastolic,
                pulse: input.pulse ?? undefined
            };
            setLogs((prev) => [next, ...prev]);
            setShowLog(false);
            return;
        }
        if (input.type === "mood") {
            const next = {
                ...base,
                feeling: input.feeling,
                moodLevel: input.moodLevel
            };
            setLogs((prev) => [next, ...prev]);
            setShowLog(false);
            return;
        }
        // meal
        const next = {
            ...base,
            mealType: input.mealType,
            description: input.description,
            calories: input.calories ?? undefined
        };
        setLogs((prev) => [next, ...prev]);
        setShowLog(false);
    }
    function deleteLog(id) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "healthHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "My Health" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Track your health metrics and wellness" })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn healthLogBtn", onClick: () => setShowLog(true), children: "+\u00A0 Log Health Data" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "healthStats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon heart", children: "\u2661" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Latest BP" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: latestBp })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon mood", children: "\u263A" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Today's Mood" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: todaysMood })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon meals", children: "\uD83C\uDF4F" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Meals Today" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: mealsToday })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "healthPanel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "healthPanelHeader", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hpTitleRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "hpIcon", children: "\u25A5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "hpTitle", children: "Health Trends" }), (0, jsx_runtime_1.jsx)("div", { className: "hpSub", children: "Monitor your health metrics over time" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hpTabs", children: [(0, jsx_runtime_1.jsx)("button", { className: "hpTab active", children: "\u2661 Blood Pressure" }), (0, jsx_runtime_1.jsx)("button", { className: "hpTab", children: "\u263A Mood" }), (0, jsx_runtime_1.jsx)("button", { className: "hpTab", children: "\uD83C\uDF4F Calories" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hpRangeTabs", children: [(0, jsx_runtime_1.jsx)("button", { className: "hpRange active", children: "Weekly" }), (0, jsx_runtime_1.jsx)("button", { className: "hpRange", children: "Monthly" }), (0, jsx_runtime_1.jsx)("button", { className: "hpRange", children: "12 Months" })] }), (0, jsx_runtime_1.jsx)("div", { className: "hpChartWrap", children: (0, jsx_runtime_1.jsx)(HealthTrendsChart_1.default, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "historyPanelV2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "hpTitle", children: "Health History" }), (0, jsx_runtime_1.jsx)("div", { className: "hpSub", children: "Your recent health logs" })] }), (0, jsx_runtime_1.jsx)("div", { className: "historyActions", children: (0, jsx_runtime_1.jsxs)("button", { className: "btn historyToggleBtn", onClick: () => setShowHistory((v) => !v), children: ["\uD83D\uDD58\u00A0 ", showHistory ? "Hide History" : "View History", " ", showHistory ? "▴" : "▾"] }) })] }), showHistory && ((0, jsx_runtime_1.jsxs)("div", { className: "historyExpanded", children: [(0, jsx_runtime_1.jsx)("div", { className: "historySelectRow", children: (0, jsx_runtime_1.jsx)("div", { className: "historySelectTitle", children: "\uD83D\uDCC5\u00A0 Select Date" }) }), (0, jsx_runtime_1.jsx)("div", { className: "calendarCard", children: (0, jsx_runtime_1.jsx)(Calendar, { month: calMonth, selected: selectedDate, onPrev: () => {
                                                const d = new Date(calMonth);
                                                d.setMonth(d.getMonth() - 1);
                                                d.setDate(1);
                                                setCalMonth(startOfDay(d));
                                            }, onNext: () => {
                                                const d = new Date(calMonth);
                                                d.setMonth(d.getMonth() + 1);
                                                d.setDate(1);
                                                setCalMonth(startOfDay(d));
                                            }, onSelect: (d) => setSelectedDate(startOfDay(d)) }) }), (0, jsx_runtime_1.jsx)("div", { className: "selectedInfo", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "selectedLine", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Selected:" }), " ", fmtSelected(selectedDate)] }), (0, jsx_runtime_1.jsxs)("div", { className: "selectedCount", children: [logsForSelectedDate.length, " health logs found"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "historySectionTitle", children: ["Health Data on ", fmtShort(selectedDate)] }), (0, jsx_runtime_1.jsxs)("div", { className: "historyCards", children: [logsForSelectedDate.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "emptyHistory", children: "No logs for this date." })), logsForSelectedDate.map((l) => {
                                                const created = new Date(l.createdAt);
                                                // Blood Pressure card
                                                if (l.type === "bloodPressure" && l.systolic && l.diastolic) {
                                                    const stage = bpStage(l.systolic, l.diastolic);
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "historyCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardHeader", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardTitle", children: [(0, jsx_runtime_1.jsx)("span", { className: "historyIcon heart", children: "\u2661" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "hTitle", children: "Blood Pressure" }), (0, jsx_runtime_1.jsxs)("div", { className: "hSub", children: ["Today at ", fmtTime(created)] })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "stagePill", children: stage })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpGrid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Systolic" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.systolic })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Diastolic" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.diastolic })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.pulse ?? "—" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "historyCardFooter", children: (0, jsx_runtime_1.jsx)("button", { className: "deleteBtn", onClick: () => deleteLog(l.id), children: "\uD83D\uDDD1\u00A0 Delete" }) })] }, l.id));
                                                }
                                                // Mood card
                                                if (l.type === "mood") {
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "historyCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardHeader", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardTitle", children: [(0, jsx_runtime_1.jsx)("span", { className: "historyIcon mood", children: "\u25C9" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "hTitle", children: "Mood" }), (0, jsx_runtime_1.jsxs)("div", { className: "hSub", children: ["Today at ", fmtTime(created)] })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "stagePill", children: l.feeling ?? "Mood" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpGrid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Feeling" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.feeling ?? "—" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Mood Level" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.moodLevel ? `${l.moodLevel}/5` : "—" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bpCell", children: [(0, jsx_runtime_1.jsx)("div", { className: "bpLabel", children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "bpValue", children: l.notes ? "✓" : "—" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "historyCardFooter", children: (0, jsx_runtime_1.jsx)("button", { className: "deleteBtn", onClick: () => deleteLog(l.id), children: "\uD83D\uDDD1\u00A0 Delete" }) })] }, l.id));
                                                }
                                                // Meal card
                                                if (l.type === "meal") {
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "historyCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardHeader", children: [(0, jsx_runtime_1.jsxs)("div", { className: "historyCardTitle", children: [(0, jsx_runtime_1.jsx)("span", { className: "historyIcon meal", children: "\uD83C\uDF4F" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "hTitle", children: "Meal" }), (0, jsx_runtime_1.jsxs)("div", { className: "hSub", children: ["Today at ", fmtTime(created)] })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "stagePill", children: l.mealType ?? "Meal" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mealBody", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mealLine", children: [(0, jsx_runtime_1.jsx)("strong", { children: "What:" }), " ", l.description ?? "—"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mealLine", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Calories:" }), " ", l.calories ?? "—"] }), l.notes && ((0, jsx_runtime_1.jsxs)("div", { className: "mealLine", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Notes:" }), " ", l.notes] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "historyCardFooter", children: (0, jsx_runtime_1.jsx)("button", { className: "deleteBtn", onClick: () => deleteLog(l.id), children: "\uD83D\uDDD1\u00A0 Delete" }) })] }, l.id));
                                                }
                                                return null;
                                            })] })] }))] })] }), showLog && (0, jsx_runtime_1.jsx)(LogHealthDataModal_1.default, { onClose: () => setShowLog(false), onSave: addLog })] }));
}
/** Calendar component (no libraries) */
function Calendar({ month, selected, onPrev, onNext, onSelect }) {
    const year = month.getFullYear();
    const m = month.getMonth();
    const monthTitle = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const first = new Date(year, m, 1);
    const last = new Date(year, m + 1, 0);
    const startWeekday = first.getDay(); // 0 Sun..6 Sat
    const daysInMonth = last.getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++)
        cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
        cells.push(new Date(year, m, d));
    while (cells.length % 7 !== 0)
        cells.push(null);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "cal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "calHeader", children: [(0, jsx_runtime_1.jsx)("button", { className: "calNav", onClick: onPrev, "aria-label": "Previous month", children: "\u2039" }), (0, jsx_runtime_1.jsx)("div", { className: "calTitle", children: monthTitle }), (0, jsx_runtime_1.jsx)("button", { className: "calNav", onClick: onNext, "aria-label": "Next month", children: "\u203A" })] }), (0, jsx_runtime_1.jsx)("div", { className: "calDow", children: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => ((0, jsx_runtime_1.jsx)("div", { className: "calDowCell", children: d }, d))) }), (0, jsx_runtime_1.jsx)("div", { className: "calGrid", children: cells.map((d, idx) => {
                    if (!d)
                        return (0, jsx_runtime_1.jsx)("div", { className: "calCell empty" }, idx);
                    const isSel = d.getFullYear() === selected.getFullYear() &&
                        d.getMonth() === selected.getMonth() &&
                        d.getDate() === selected.getDate();
                    return ((0, jsx_runtime_1.jsx)("button", { className: `calCell day ${isSel ? "selected" : ""}`, onClick: () => onSelect(d), children: d.getDate() }, idx));
                }) })] }));
}
