import { useMemo, useState } from "react";
import { SymptomLog } from "./LogSymptomModal";

type Props = {
  logs: SymptomLog[];
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: Partial<SymptomLog>) => void;
};

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function fmt(ts: number) {
  const d = new Date(ts);
  const hh = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `Today at ${hh}`;
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function severityChip(sev: number) {
  if (sev <= 2) return { text: "Mild", cls: "chip mild" };
  if (sev === 3) return { text: "Moderate", cls: "chip moderate" };
  return { text: "Severe", cls: "chip severe" };
}

export default function SymptomHistoryPanel({ logs, onDelete, onEdit }: Props) {
  const [selectedDay, setSelectedDay] = useState<number>(() => startOfDay(Date.now()));

  const filtered = useMemo(
    () => logs.filter((l) => startOfDay(l.createdAt) === selectedDay),
    [logs, selectedDay]
  );

  // simple mini calendar: just show current month dates (good enough for class demo)
  const monthDates = useMemo(() => {
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

  return (
    <div className="panel" style={{ marginTop: 14 }}>
      <div className="panelHeaderRow">
        <div>
          <div className="panelTitle">Symptom History</div>
          <div className="panelSub">Your recent symptom logs</div>
        </div>
      </div>

      <div className="historyBlock">
        <div className="historyTitle">Select Date</div>

        <div className="calendarBox">
          <div className="calendarHeader">
            <span>
              {new Date(monthDates.y, monthDates.m, 1).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric"
              })}
            </span>
          </div>

          <div className="calendarGrid">
            {monthDates.days.map((ts) => {
              const dayNum = new Date(ts).getDate();
              const active = ts === selectedDay;
              return (
                <button
                  key={ts}
                  className={`dayBtn ${active ? "active" : ""}`}
                  onClick={() => setSelectedDay(ts)}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        <div className="selectedBanner purple">
          <div>
            <div className="selectedTop">
              Selected: {new Date(selectedDay).toLocaleDateString(undefined, { weekday: "long" })},{" "}
              {new Date(selectedDay).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div className="selectedBottom">{filtered.length} symptom logs found</div>
          </div>
        </div>

        <div className="historyTitle" style={{ marginTop: 12 }}>
          Symptoms on {fmtDate(selectedDay)}
        </div>

        <div className="historyList">
          {filtered.length === 0 ? (
            <div className="muted" style={{ padding: 12 }}>
              No logs for this date.
            </div>
          ) : (
            filtered.map((l) => {
              const chip = severityChip(l.severity);
              return (
                <div className="historyItem" key={l.id}>
                  <div className="historyMain">
                    <div className="historyName">{l.symptom}</div>
                    <div className="historyTime">{fmt(l.createdAt)}</div>
                    {l.notes ? <div className="historyNotes">{l.notes}</div> : null}
                  </div>

                  <div className="historyActions">
                    <span className={chip.cls}>{chip.text}</span>

                    <button
                      className="iconBtn"
                      aria-label="Edit severity"
                      onClick={() => {
                        const next = Math.min(5, l.severity + 1);
                        onEdit(l.id, { severity: next });
                      }}
                      title="Increase severity"
                    >
                      ✎
                    </button>

                    <button className="iconBtn danger" aria-label="Delete" onClick={() => onDelete(l.id)}>
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}