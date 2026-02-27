"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SymptomTrendsChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const seriesOrder = [
    "Tremor - Right Hand",
    "Stiffness",
    "Balance Issues",
    "Fatigue"
];
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function avg(nums) {
    if (!nums.length)
        return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function buildBuckets(range) {
    const now = new Date();
    const labels = [];
    const bucketStarts = [];
    if (range === "weekly") {
        // last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            d.setHours(0, 0, 0, 0);
            bucketStarts.push(d.getTime());
            labels.push(d.toLocaleDateString(undefined, { weekday: "short" }));
        }
    }
    else if (range === "monthly") {
        // last 4 weeks (weekly points)
        for (let i = 3; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i * 7);
            d.setHours(0, 0, 0, 0);
            bucketStarts.push(d.getTime());
            labels.push(`W${4 - i}`);
        }
    }
    else {
        // last 12 months (monthly points)
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            d.setHours(0, 0, 0, 0);
            bucketStarts.push(d.getTime());
            labels.push(d.toLocaleDateString(undefined, { month: "short" }));
        }
    }
    return { labels, bucketStarts };
}
function toPoints(values, w, h) {
    const pad = 26;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    const minY = 1;
    const maxY = 5;
    return values.map((v, i) => {
        const x = pad + (innerW * i) / (values.length - 1 || 1);
        const yNorm = (clamp(v || 0, minY, maxY) - minY) / (maxY - minY);
        const y = pad + innerH * (1 - yNorm);
        return { x, y };
    });
}
function SymptomTrendsChart({ logs, range, onChangeRange }) {
    const { labels, bucketStarts } = (0, react_1.useMemo)(() => buildBuckets(range), [range]);
    const dataBySeries = (0, react_1.useMemo)(() => {
        // For each series and each bucket, compute avg severity for that bucket
        const map = {};
        for (const s of seriesOrder)
            map[s] = [];
        for (let i = 0; i < bucketStarts.length; i++) {
            const start = bucketStarts[i];
            const end = i === bucketStarts.length - 1
                ? Date.now()
                : bucketStarts[i + 1] - 1;
            for (const s of seriesOrder) {
                const bucketLogs = logs.filter((l) => l.symptom === s && l.createdAt >= start && l.createdAt <= end);
                const v = avg(bucketLogs.map((l) => l.severity));
                map[s].push(v);
            }
        }
        return map;
    }, [logs, bucketStarts]);
    const W = 980;
    const H = 260;
    const colors = ["#ef4444", "#f59e0b", "#2563eb", "#7c3aed"]; // simple fixed palette
    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "tabsRow", children: [(0, jsx_runtime_1.jsx)("button", { className: `tabBtn ${range === "weekly" ? "active" : ""}`, onClick: () => onChangeRange("weekly"), children: "Weekly" }), (0, jsx_runtime_1.jsx)("button", { className: `tabBtn ${range === "monthly" ? "active" : ""}`, onClick: () => onChangeRange("monthly"), children: "Monthly" }), (0, jsx_runtime_1.jsx)("button", { className: `tabBtn ${range === "year" ? "active" : ""}`, onClick: () => onChangeRange("year"), children: "12 Months" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "chartWrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "chartLeftLabel", children: ["This ", range === "weekly" ? "Week" : range === "monthly" ? "Month" : "Year"] }), (0, jsx_runtime_1.jsx)("div", { className: "chartRightLabel", children: "Multiple symptoms tracked" }), (0, jsx_runtime_1.jsxs)("svg", { width: "100%", viewBox: `0 0 ${W} ${H}`, "aria-label": "Symptom trends chart", children: [[1, 2, 3, 4, 5].map((lv) => {
                                const y = 26 + ((H - 52) * (1 - (lv - 1) / 4));
                                return (0, jsx_runtime_1.jsx)("line", { x1: 26, x2: W - 26, y1: y, y2: y, stroke: "#e5e7eb", strokeWidth: "1" }, lv);
                            }), seriesOrder.map((s, idx) => {
                                const pts = toPoints(dataBySeries[s], W, H);
                                const d = pts
                                    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                                    .join(" ");
                                return ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("path", { d: d, fill: "none", stroke: colors[idx], strokeWidth: "2.2" }), pts.map((p, i) => ((0, jsx_runtime_1.jsx)("circle", { cx: p.x, cy: p.y, r: "3.2", fill: colors[idx] }, i)))] }, s));
                            }), labels.map((lab, i) => {
                                const x = 26 + ((W - 52) * i) / (labels.length - 1 || 1);
                                return ((0, jsx_runtime_1.jsx)("text", { x: x, y: H - 10, fontSize: "12", textAnchor: "middle", fill: "#6b7280", children: lab }, lab));
                            }), (0, jsx_runtime_1.jsx)("text", { x: 10, y: H / 2, fontSize: "12", fill: "#6b7280", transform: `rotate(-90 10 ${H / 2})`, children: "Severity (1\u20135)" })] }), (0, jsx_runtime_1.jsx)("div", { className: "legendRow", children: seriesOrder.map((s, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "legendItem", children: [(0, jsx_runtime_1.jsx)("span", { className: "legendDot", style: { background: colors[idx] } }), (0, jsx_runtime_1.jsx)("span", { children: s.includes("Tremor") ? "Tremor" : s.split(" ")[0] })] }, s))) })] })] }));
}
