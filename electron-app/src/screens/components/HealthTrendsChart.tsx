export default function HealthTrendsChart() {
  // Simple static SVG to mimic the screenshot trend lines.
  // Later you can hook this to real data.
  return (
    <div className="chartBox">
      <svg viewBox="0 0 900 260" width="100%" height="260" aria-label="Health Trends Chart">
        {/* grid */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            x2="880"
            y1={30 + i * 35}
            y2={30 + i * 35}
            stroke="#e8edf6"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={50 + i * 138}
            x2={50 + i * 138}
            y1="30"
            y2="230"
            stroke="#eef2fb"
            strokeWidth="1"
          />
        ))}

        {/* axes labels */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <text key={d} x={50 + i * 138} y="250" fontSize="12" fill="#667085" textAnchor="middle">
            {d}
          </text>
        ))}

        {/* systolic (red) */}
        <path
          d="M50 70 C 180 55, 300 60, 326 62 C 450 72, 500 50, 602 60 C 720 70, 760 80, 880 72"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />
        {/* diastolic (blue) */}
        <path
          d="M50 140 C 180 130, 300 145, 326 148 C 450 152, 500 132, 602 145 C 720 155, 760 160, 880 150"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
        />
        {/* pulse (green) */}
        <path
          d="M50 170 C 180 162, 300 175, 326 178 C 450 182, 500 160, 602 172 C 720 185, 760 190, 880 180"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
        />

        {/* points */}
        {[50, 188, 326, 464, 602, 740, 880].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={[70, 62, 78, 58, 68, 80, 72][i]} r="4" fill="#ef4444" />
            <circle cx={x} cy={[140, 138, 150, 140, 150, 160, 150][i]} r="4" fill="#3b82f6" />
            <circle cx={x} cy={[170, 168, 182, 170, 178, 190, 180][i]} r="4" fill="#10b981" />
          </g>
        ))}
      </svg>

      <div className="chartLegend">
        <span><span className="dot red" /> Systolic</span>
        <span><span className="dot blue" /> Diastolic</span>
        <span><span className="dot green" /> Pulse</span>
      </div>
    </div>
  );
}