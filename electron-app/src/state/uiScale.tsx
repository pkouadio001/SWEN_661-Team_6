/*
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import HealthTrendsChart from "../screens/components/HealthTrendsChart";
import LogHealthDataModal, { HealthLogInput } from "../screens/components/LogHealthDataModal";

type HealthLog = {
  id: string;
  type: "bloodPressure" | "mood" | "meal";
  createdAt: string; // ISO

  // Blood Pressure
  systolic?: number;
  diastolic?: number;
  pulse?: number;

  // Mood
  feeling?: string; // Happy, Calm, etc.
  moodLevel?: number; // 1..5

  // Meal
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  description?: string;
  calories?: number;

  // Shared
  notes?: string;
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtSelected(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function fmtShort(d: Date) {
  return d.toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function bpStage(s: number, d: number) {
  // simple label (good enough for demo UI)
  if (s >= 140 || d >= 90) return "High Stage 2";
  if (s >= 130 || d >= 80) return "High Stage 1";
  if (s >= 120 && d < 80) return "Elevated";
  return "Normal";
}

export default function MyHealthScreen() {
  const nav = useNavigate();

  const [showLog, setShowLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [calMonth, setCalMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return startOfDay(d);
  });

  // Demo seed data (feel free to tweak)
  const [logs, setLogs] = useState<HealthLog[]>([
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

  const latestBp = useMemo(() => {
    const bp = logs.find((l) => l.type === "bloodPressure");
    if (!bp?.systolic || !bp?.diastolic) return "—";
    return `${bp.systolic}/${bp.diastolic}`;
  }, [logs]);

  const todaysMood = useMemo(() => {
    const m = logs.find((l) => l.type === "mood");
    if (!m) return "—";
    return m.feeling ?? "—";
  }, [logs]);

  const mealsToday = useMemo(() => {
    // simple demo: count meal logs (assume all are today, or you can filter by date)
    return logs.filter((l) => l.type === "meal").length;
  }, [logs]);

  const logsForSelectedDate = useMemo(() => {
    return logs.filter((l) => sameDay(new Date(l.createdAt), selectedDate));
  }, [logs, selectedDate]);

  function addLog(input: HealthLogInput) {
    const base: HealthLog = {
      id: uid(),
      type: input.type,
      createdAt: new Date().toISOString(),
      notes: input.notes?.trim() || undefined
    };

    if (input.type === "bloodPressure") {
      const next: HealthLog = {
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
      const next: HealthLog = {
        ...base,
        feeling: input.feeling,
        moodLevel: input.moodLevel
      };
      setLogs((prev) => [next, ...prev]);
      setShowLog(false);
      return;
    }

    // meal
    const next: HealthLog = {
      ...base,
      mealType: input.mealType,
      description: input.description,
      calories: input.calories ?? undefined
    };
    setLogs((prev) => [next, ...prev]);
    setShowLog(false);
  }

  function deleteLog(id: string) {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="healthHeader">
            <div>
              <div className="pageTitle">My Health</div>
              <div className="pageSub">Track your health metrics and wellness</div>
            </div>

            <button className="btn healthLogBtn" onClick={() => setShowLog(true)}>
              +&nbsp; Log Health Data
            </button>
          </div>

          <div className="healthStats">
            <div className="statCard">
              <div className="statIcon heart">♡</div>
              <div>
                <div className="statLabel">Latest BP</div>
                <div className="statValue">{latestBp}</div>
              </div>
            </div>

            <div className="statCard">
              <div className="statIcon mood">☺</div>
              <div>
                <div className="statLabel">Today's Mood</div>
                <div className="statValue">{todaysMood}</div>
              </div>
            </div>

            <div className="statCard">
              <div className="statIcon meals">🍏</div>
              <div>
                <div className="statLabel">Meals Today</div>
                <div className="statValue">{mealsToday}</div>
              </div>
            </div>
          </div>

          <div className="healthPanel">
            <div className="healthPanelHeader">
              <div className="hpTitleRow">
                <div className="hpIcon">▥</div>
                <div>
                  <div className="hpTitle">Health Trends</div>
                  <div className="hpSub">Monitor your health metrics over time</div>
                </div>
              </div>

              <div className="hpTabs">
                <button className="hpTab active">♡ Blood Pressure</button>
                <button className="hpTab">☺ Mood</button>
                <button className="hpTab">🍏 Calories</button>
              </div>
            </div>

            <div className="hpRangeTabs">
              <button className="hpRange active">Weekly</button>
              <button className="hpRange">Monthly</button>
              <button className="hpRange">12 Months</button>
            </div>

            <div className="hpChartWrap">
              <HealthTrendsChart />
            </div>
          </div>

          {/* --- Health History (collapsible) --- *//*}
          <div className="historyPanelV2">
            <div>
              <div className="hpTitle">Health History</div>
              <div className="hpSub">Your recent health logs</div>
            </div>

            <div className="historyActions">
              <button className="btn historyToggleBtn" onClick={() => setShowHistory((v) => !v)}>
                🕘&nbsp; {showHistory ? "Hide History" : "View History"} {showHistory ? "▴" : "▾"}
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="historyExpanded">
              <div className="historySelectRow">
                <div className="historySelectTitle">📅&nbsp; Select Date</div>
              </div>

              <div className="calendarCard">
                <Calendar
                  month={calMonth}
                  selected={selectedDate}
                  onPrev={() => {
                    const d = new Date(calMonth);
                    d.setMonth(d.getMonth() - 1);
                    d.setDate(1);
                    setCalMonth(startOfDay(d));
                  }}
                  onNext={() => {
                    const d = new Date(calMonth);
                    d.setMonth(d.getMonth() + 1);
                    d.setDate(1);
                    setCalMonth(startOfDay(d));
                  }}
                  onSelect={(d) => setSelectedDate(startOfDay(d))}
                />
              </div>

              <div className="selectedInfo">
                <div>
                  <div className="selectedLine">
                    <strong>Selected:</strong> {fmtSelected(selectedDate)}
                  </div>
                  <div className="selectedCount">{logsForSelectedDate.length} health logs found</div>
                </div>
              </div>

              <div className="historySectionTitle">Health Data on {fmtShort(selectedDate)}</div>

              <div className="historyCards">
                {logsForSelectedDate.length === 0 && (
                  <div className="emptyHistory">No logs for this date.</div>
                )}

                {logsForSelectedDate.map((l) => {
                  const created = new Date(l.createdAt);

                  // Blood Pressure card
                  if (l.type === "bloodPressure" && l.systolic && l.diastolic) {
                    const stage = bpStage(l.systolic, l.diastolic);
                    return (
                      <div key={l.id} className="historyCard">
                        <div className="historyCardHeader">
                          <div className="historyCardTitle">
                            <span className="historyIcon heart">♡</span>
                            <div>
                              <div className="hTitle">Blood Pressure</div>
                              <div className="hSub">Today at {fmtTime(created)}</div>
                            </div>
                          </div>

                          <span className="stagePill">{stage}</span>
                        </div>

                        <div className="bpGrid">
                          <div className="bpCell">
                            <div className="bpLabel">Systolic</div>
                            <div className="bpValue">{l.systolic}</div>
                          </div>
                          <div className="bpCell">
                            <div className="bpLabel">Diastolic</div>
                            <div className="bpValue">{l.diastolic}</div>
                          </div>
                          <div className="bpCell">
                            <div className="bpLabel">Pulse</div>
                            <div className="bpValue">{l.pulse ?? "—"}</div>
                          </div>
                        </div>

                        <div className="historyCardFooter">
                          <button className="deleteBtn" onClick={() => deleteLog(l.id)}>
                            🗑&nbsp; Delete
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Mood card
                  if (l.type === "mood") {
                    return (
                      <div key={l.id} className="historyCard">
                        <div className="historyCardHeader">
                          <div className="historyCardTitle">
                            <span className="historyIcon mood">◉</span>
                            <div>
                              <div className="hTitle">Mood</div>
                              <div className="hSub">Today at {fmtTime(created)}</div>
                            </div>
                          </div>

                          <span className="stagePill">{l.feeling ?? "Mood"}</span>
                        </div>

                        <div className="bpGrid">
                          <div className="bpCell">
                            <div className="bpLabel">Feeling</div>
                            <div className="bpValue">{l.feeling ?? "—"}</div>
                          </div>
                          <div className="bpCell">
                            <div className="bpLabel">Mood Level</div>
                            <div className="bpValue">{l.moodLevel ? `${l.moodLevel}/5` : "—"}</div>
                          </div>
                          <div className="bpCell">
                            <div className="bpLabel">Notes</div>
                            <div className="bpValue">{l.notes ? "✓" : "—"}</div>
                          </div>
                        </div>

                        <div className="historyCardFooter">
                          <button className="deleteBtn" onClick={() => deleteLog(l.id)}>
                            🗑&nbsp; Delete
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Meal card
                  if (l.type === "meal") {
                    return (
                      <div key={l.id} className="historyCard">
                        <div className="historyCardHeader">
                          <div className="historyCardTitle">
                            <span className="historyIcon meal">🍏</span>
                            <div>
                              <div className="hTitle">Meal</div>
                              <div className="hSub">Today at {fmtTime(created)}</div>
                            </div>
                          </div>

                          <span className="stagePill">{l.mealType ?? "Meal"}</span>
                        </div>

                        <div className="mealBody">
                          <div className="mealLine">
                            <strong>What:</strong> {l.description ?? "—"}
                          </div>
                          <div className="mealLine">
                            <strong>Calories:</strong> {l.calories ?? "—"}
                          </div>
                          {l.notes && (
                            <div className="mealLine">
                              <strong>Notes:</strong> {l.notes}
                            </div>
                          )}
                        </div>

                        <div className="historyCardFooter">
                          <button className="deleteBtn" onClick={() => deleteLog(l.id)}>
                            🗑&nbsp; Delete
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showLog && <LogHealthDataModal onClose={() => setShowLog(false)} onSave={addLog} />}
    </div>
  );
}

/** Calendar component (no libraries) */
/*function Calendar({
  month,
  selected,
  onPrev,
  onNext,
  onSelect
}: {
  month: Date; // first day of month
  selected: Date;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (d: Date) => void;
}) {
  const year = month.getFullYear();
  const m = month.getMonth();

  const monthTitle = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const first = new Date(year, m, 1);
  const last = new Date(year, m + 1, 0);

  const startWeekday = first.getDay(); // 0 Sun..6 Sat
  const daysInMonth = last.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal">
      <div className="calHeader">
        <button className="calNav" onClick={onPrev} aria-label="Previous month">
          ‹
        </button>
        <div className="calTitle">{monthTitle}</div>
        <button className="calNav" onClick={onNext} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="calDow">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="calDowCell">
            {d}
          </div>
        ))}
      </div>

      <div className="calGrid">
        {cells.map((d, idx) => {
          if (!d) return <div key={idx} className="calCell empty" />;

          const isSel =
            d.getFullYear() === selected.getFullYear() &&
            d.getMonth() === selected.getMonth() &&
            d.getDate() === selected.getDate();

          return (
            <button
              key={idx}
              className={`calCell day ${isSel ? "selected" : ""}`}
              onClick={() => onSelect(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}*/