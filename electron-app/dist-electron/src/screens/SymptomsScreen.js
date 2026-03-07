"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SymptomsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const LogSymptomModal_1 = __importDefault(require("./components/LogSymptomModal"));
const SymptomHistoryPanel_1 = __importDefault(require("./components/SymptomHistoryPanel"));
const SymptomTrendsChart_1 = __importDefault(require("./components/SymptomTrendsChart"));
const react_router_dom_1 = require("react-router-dom");
const STORAGE_KEY = "careconnect.symptomLogs";
function readLogs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return parsed.map((l) => ({ ...l, createdAt: Number(l.createdAt) }));
    }
    catch {
        return [];
    }
}
function writeLogs(logs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function fmtDate(ts) {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function SymptomsScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const [logs, setLogs] = (0, react_1.useState)(() => readLogs());
    const [range, setRange] = (0, react_1.useState)("weekly");
    const [showLogModal, setShowLogModal] = (0, react_1.useState)(false);
    const [showHistory, setShowHistory] = (0, react_1.useState)(false);
    const todayCount = (0, react_1.useMemo)(() => {
        const today = startOfDay(Date.now());
        return logs.filter((l) => startOfDay(l.createdAt) === today).length;
    }, [logs]);
    const averageSeverity = (0, react_1.useMemo)(() => {
        if (logs.length === 0)
            return 0;
        const sum = logs.reduce((acc, l) => acc + l.severity, 0);
        return Math.round((sum / logs.length) * 10) / 10;
    }, [logs]);
    const mostCommon = (0, react_1.useMemo)(() => {
        if (logs.length === 0)
            return "—";
        const counts = new Map();
        for (const l of logs)
            counts.set(l.symptom, (counts.get(l.symptom) ?? 0) + 1);
        let best = "";
        let bestCount = -1;
        counts.forEach((c, k) => {
            if (c > bestCount) {
                bestCount = c;
                best = k;
            }
        });
        return best;
    }, [logs]);
    function addLog(newLog) {
        const log = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            ...newLog
        };
        const next = [log, ...logs];
        setLogs(next);
        writeLogs(next);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pageTopRow", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "Symptom Tracker" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Monitor and record your symptoms" })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn dark", onClick: () => setShowLogModal(true), children: "+ Log Symptom" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "statRow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon blue", children: "\u3030" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Today\u2019s Logs" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: todayCount })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon green", children: "\u2198" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Average Severity" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: averageSeverity || "—" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "statCard", children: [(0, jsx_runtime_1.jsx)("div", { className: "statIcon purple", children: "\uD83D\uDCC8" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "statLabel", children: "Most Common" }), (0, jsx_runtime_1.jsx)("div", { className: "statValue", children: mostCommon })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panelHeaderRow", children: (0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderLeft", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelIcon purple", children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Symptom Trends" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Track your symptom severity over time" })] })] }) }), (0, jsx_runtime_1.jsx)(SymptomTrendsChart_1.default, { logs: logs, range: range, onChangeRange: setRange })] }), (0, jsx_runtime_1.jsx)("div", { className: "panel slim", style: { marginTop: 14 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderRow", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Symptom History" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Your recent symptom logs" })] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn outline", onClick: () => setShowHistory((s) => !s), children: [showHistory ? "Hide History" : "View History", " \u25BE"] })] }) }), showHistory && ((0, jsx_runtime_1.jsx)(SymptomHistoryPanel_1.default, { logs: logs, onDelete: (id) => {
                                    const next = logs.filter((l) => l.id !== id);
                                    setLogs(next);
                                    writeLogs(next);
                                }, onEdit: (id, patch) => {
                                    const next = logs.map((l) => (l.id === id ? { ...l, ...patch } : l));
                                    setLogs(next);
                                    writeLogs(next);
                                } }))] }), showLogModal && ((0, jsx_runtime_1.jsx)(LogSymptomModal_1.default, { onClose: () => setShowLogModal(false), onSave: (data) => {
                            addLog(data);
                            setShowLogModal(false);
                        } }))] })] }));
}
