"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExerciseProgressChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function buildPath(points, w, h, pad) {
    const values = points.map((p) => p.minutes);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    // avoid flat-line division by 0
    const span = Math.max(1, maxV - minV);
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    return points
        .map((p, i) => {
        const x = pad + (i / (points.length - 1)) * innerW;
        const norm = (p.minutes - minV) / span; // 0..1
        const y = pad + (1 - norm) * innerH;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
        .join(" ");
}
function ExerciseProgressChart() {
    const [range, setRange] = (0, react_1.useState)("weekly");
    const data = (0, react_1.useMemo)(() => ({
        weekly: [
            { label: "Mon", minutes: 42 },
            { label: "Tue", minutes: 60 },
            { label: "Wed", minutes: 35 },
            { label: "Thu", minutes: 55 },
            { label: "Fri", minutes: 50 },
            { label: "Sat", minutes: 72 },
            { label: "Sun", minutes: 20 }
        ],
        monthly: Array.from({ length: 4 }).map((_, i) => ({
            label: `W${i + 1}`,
            minutes: [210, 260, 240, 300][i]
        })),
        year: [
            { label: "Jan", minutes: 780 },
            { label: "Feb", minutes: 720 },
            { label: "Mar", minutes: 860 },
            { label: "Apr", minutes: 810 },
            { label: "May", minutes: 900 },
            { label: "Jun", minutes: 760 },
            { label: "Jul", minutes: 920 },
            { label: "Aug", minutes: 880 },
            { label: "Sep", minutes: 840 },
            { label: "Oct", minutes: 910 },
            { label: "Nov", minutes: 870 },
            { label: "Dec", minutes: 950 }
        ]
    }), []);
    const points = data[range];
    const total = points.reduce((sum, p) => sum + p.minutes, 0);
    const headline = range === "weekly" ? "This Week" : range === "monthly" ? "This Month" : "This Year";
    // SVG sizing similar to screenshot
    const W = 520;
    const H = 150;
    const PAD = 18;
    const path = (0, react_1.useMemo)(() => buildPath(points, W, H, PAD), [points]);
    const yTicks = (0, react_1.useMemo)(() => {
        const values = points.map((p) => p.minutes);
        const minV = Math.min(...values);
        const maxV = Math.max(...values);
        const span = Math.max(1, maxV - minV);
        // 4 ticks
        const ticks = [0, 0.33, 0.66, 1].map((t) => Math.round(minV + t * span));
        return Array.from(new Set(ticks)); // remove duplicates if flat
    }, [points]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "exChart", children: [(0, jsx_runtime_1.jsxs)("div", { className: "exChartHeader", children: [(0, jsx_runtime_1.jsx)("div", { className: "exChartTitle", children: "Exercise Progress" }), (0, jsx_runtime_1.jsxs)("div", { className: "segmented", role: "tablist", "aria-label": "Exercise progress range", children: [(0, jsx_runtime_1.jsx)("button", { className: `segBtn ${range === "weekly" ? "active" : ""}`, onClick: () => setRange("weekly"), type: "button", role: "tab", "aria-selected": range === "weekly", children: "Weekly" }), (0, jsx_runtime_1.jsx)("button", { className: `segBtn ${range === "monthly" ? "active" : ""}`, onClick: () => setRange("monthly"), type: "button", role: "tab", "aria-selected": range === "monthly", children: "Monthly" }), (0, jsx_runtime_1.jsx)("button", { className: `segBtn ${range === "year" ? "active" : ""}`, onClick: () => setRange("year"), type: "button", role: "tab", "aria-selected": range === "year", children: "12 Months" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exChartSubRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "exChartSub", children: headline }), (0, jsx_runtime_1.jsxs)("div", { className: "exChartTotal", children: [total, " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exChartBody", children: [(0, jsx_runtime_1.jsxs)("div", { className: "exChartYAxis", "aria-hidden": "true", children: [yTicks
                                .slice()
                                .reverse()
                                .map((t) => ((0, jsx_runtime_1.jsx)("div", { className: "yTick", children: t }, t))), (0, jsx_runtime_1.jsx)("div", { className: "yAxisLabel", children: "Minutes" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "exChartSvgWrap", children: [(0, jsx_runtime_1.jsxs)("svg", { viewBox: `0 0 ${W} ${H}`, className: "exSvg", role: "img", "aria-label": "Exercise chart", children: [(0, jsx_runtime_1.jsx)("g", { className: "grid", children: [0, 1, 2, 3].map((i) => {
                                            const y = PAD + (i / 3) * (H - PAD * 2);
                                            return (0, jsx_runtime_1.jsx)("line", { x1: PAD, y1: y, x2: W - PAD, y2: y }, i);
                                        }) }), (0, jsx_runtime_1.jsx)("path", { d: path, className: "line" }), points.map((p, i) => {
                                        const innerW = W - PAD * 2;
                                        const x = PAD + (i / (points.length - 1)) * innerW;
                                        const values = points.map((pp) => pp.minutes);
                                        const minV = Math.min(...values);
                                        const maxV = Math.max(...values);
                                        const span = Math.max(1, maxV - minV);
                                        const norm = (p.minutes - minV) / span;
                                        const y = PAD + (1 - norm) * (H - PAD * 2);
                                        return (0, jsx_runtime_1.jsx)("circle", { cx: x, cy: y, r: 4, className: "dot" }, p.label);
                                    })] }), (0, jsx_runtime_1.jsx)("div", { className: "exXAxis", "aria-hidden": "true", children: points.map((p) => ((0, jsx_runtime_1.jsx)("div", { className: "xTick", children: p.label }, p.label))) })] })] })] }));
}
