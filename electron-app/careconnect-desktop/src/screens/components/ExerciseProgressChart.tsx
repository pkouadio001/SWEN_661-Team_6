import { useMemo, useState } from "react";

type RangeKey = "weekly" | "monthly" | "year";

type Point = { label: string; minutes: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildPath(points: Point[], w: number, h: number, pad: number) {
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

export default function ExerciseProgressChart() {
  const [range, setRange] = useState<RangeKey>("weekly");

  const data = useMemo<Record<RangeKey, Point[]>>(
    () => ({
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
    }),
    []
  );

  const points = data[range];

  const total = points.reduce((sum, p) => sum + p.minutes, 0);
  const headline =
    range === "weekly" ? "This Week" : range === "monthly" ? "This Month" : "This Year";

  // SVG sizing similar to screenshot
  const W = 520;
  const H = 150;
  const PAD = 18;

  const path = useMemo(() => buildPath(points, W, H, PAD), [points]);

  const yTicks = useMemo(() => {
    const values = points.map((p) => p.minutes);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = Math.max(1, maxV - minV);

    // 4 ticks
    const ticks = [0, 0.33, 0.66, 1].map((t) => Math.round(minV + t * span));
    return Array.from(new Set(ticks)); // remove duplicates if flat
  }, [points]);

  return (
    <div className="exChart">
      <div className="exChartHeader">
        <div className="exChartTitle">Exercise Progress</div>

        <div className="segmented" role="tablist" aria-label="Exercise progress range">
          <button
            className={`segBtn ${range === "weekly" ? "active" : ""}`}
            onClick={() => setRange("weekly")}
            type="button"
            role="tab"
            aria-selected={range === "weekly"}
          >
            Weekly
          </button>
          <button
            className={`segBtn ${range === "monthly" ? "active" : ""}`}
            onClick={() => setRange("monthly")}
            type="button"
            role="tab"
            aria-selected={range === "monthly"}
          >
            Monthly
          </button>
          <button
            className={`segBtn ${range === "year" ? "active" : ""}`}
            onClick={() => setRange("year")}
            type="button"
            role="tab"
            aria-selected={range === "year"}
          >
            12 Months
          </button>
        </div>
      </div>

      <div className="exChartSubRow">
        <div className="exChartSub">{headline}</div>
        <div className="exChartTotal">{total} min</div>
      </div>

      <div className="exChartBody">
        <div className="exChartYAxis" aria-hidden="true">
          {yTicks
            .slice()
            .reverse()
            .map((t) => (
              <div key={t} className="yTick">
                {t}
              </div>
            ))}
          <div className="yAxisLabel">Minutes</div>
        </div>

        <div className="exChartSvgWrap">
          <svg viewBox={`0 0 ${W} ${H}`} className="exSvg" role="img" aria-label="Exercise chart">
            {/* grid */}
            <g className="grid">
              {[0, 1, 2, 3].map((i) => {
                const y = PAD + (i / 3) * (H - PAD * 2);
                return <line key={i} x1={PAD} y1={y} x2={W - PAD} y2={y} />;
              })}
            </g>

            {/* line */}
            <path d={path} className="line" />

            {/* dots */}
            {points.map((p, i) => {
              const innerW = W - PAD * 2;
              const x = PAD + (i / (points.length - 1)) * innerW;

              const values = points.map((pp) => pp.minutes);
              const minV = Math.min(...values);
              const maxV = Math.max(...values);
              const span = Math.max(1, maxV - minV);
              const norm = (p.minutes - minV) / span;
              const y = PAD + (1 - norm) * (H - PAD * 2);

              return <circle key={p.label} cx={x} cy={y} r={4} className="dot" />;
            })}
          </svg>

          <div className="exXAxis" aria-hidden="true">
            {points.map((p) => (
              <div key={p.label} className="xTick">
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}