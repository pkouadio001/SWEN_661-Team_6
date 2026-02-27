import { useMemo } from "react";
import { SymptomLog, SymptomType } from "./LogSymptomModal";

export type TrendRange = "weekly" | "monthly" | "year";

type Props = {
  logs: SymptomLog[];
  range: TrendRange;
  onChangeRange: (r: TrendRange) => void;
};

const seriesOrder: SymptomType[] = [
  "Tremor - Right Hand",
  "Stiffness",
  "Balance Issues",
  "Fatigue"
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function buildBuckets(range: TrendRange) {
  const now = new Date();
  const labels: string[] = [];
  const bucketStarts: number[] = [];

  if (range === "weekly") {
    // last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      bucketStarts.push(d.getTime());
      labels.push(d.toLocaleDateString(undefined, { weekday: "short" }));
    }
  } else if (range === "monthly") {
    // last 4 weeks (weekly points)
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      d.setHours(0, 0, 0, 0);
      bucketStarts.push(d.getTime());
      labels.push(`W${4 - i}`);
    }
  } else {
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

function toPoints(values: number[], w: number, h: number) {
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

export default function SymptomTrendsChart({ logs, range, onChangeRange }: Props) {
  const { labels, bucketStarts } = useMemo(() => buildBuckets(range), [range]);

  const dataBySeries = useMemo(() => {
    // For each series and each bucket, compute avg severity for that bucket
    const map: Record<string, number[]> = {};
    for (const s of seriesOrder) map[s] = [];

    for (let i = 0; i < bucketStarts.length; i++) {
      const start = bucketStarts[i];
      const end =
        i === bucketStarts.length - 1
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

  return (
    <div style={{ marginTop: 12 }}>
      <div className="tabsRow">
        <button className={`tabBtn ${range === "weekly" ? "active" : ""}`} onClick={() => onChangeRange("weekly")}>
          Weekly
        </button>
        <button className={`tabBtn ${range === "monthly" ? "active" : ""}`} onClick={() => onChangeRange("monthly")}>
          Monthly
        </button>
        <button className={`tabBtn ${range === "year" ? "active" : ""}`} onClick={() => onChangeRange("year")}>
          12 Months
        </button>
      </div>

      <div className="chartWrap">
        <div className="chartLeftLabel">This {range === "weekly" ? "Week" : range === "monthly" ? "Month" : "Year"}</div>
        <div className="chartRightLabel">Multiple symptoms tracked</div>

        <svg width="100%" viewBox={`0 0 ${W} ${H}`} aria-label="Symptom trends chart">
          {/* grid */}
          {[1, 2, 3, 4, 5].map((lv) => {
            const y = 26 + ((H - 52) * (1 - (lv - 1) / 4));
            return <line key={lv} x1={26} x2={W - 26} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
          })}

          {/* series lines */}
          {seriesOrder.map((s, idx) => {
            const pts = toPoints(dataBySeries[s], W, H);
            const d = pts
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
              .join(" ");
            return (
              <g key={s}>
                <path d={d} fill="none" stroke={colors[idx]} strokeWidth="2.2" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3.2" fill={colors[idx]} />
                ))}
              </g>
            );
          })}

          {/* x labels */}
          {labels.map((lab, i) => {
            const x = 26 + ((W - 52) * i) / (labels.length - 1 || 1);
            return (
              <text key={lab} x={x} y={H - 10} fontSize="12" textAnchor="middle" fill="#6b7280">
                {lab}
              </text>
            );
          })}

          {/* y axis label */}
          <text x={10} y={H / 2} fontSize="12" fill="#6b7280" transform={`rotate(-90 10 ${H / 2})`}>
            Severity (1–5)
          </text>
        </svg>

        <div className="legendRow">
          {seriesOrder.map((s, idx) => (
            <div className="legendItem" key={s}>
              <span className="legendDot" style={{ background: colors[idx] }} />
              <span>{s.includes("Tremor") ? "Tremor" : s.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}