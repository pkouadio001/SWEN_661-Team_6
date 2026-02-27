import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import LogSymptomModal, { SymptomLog, SymptomType } from "./components/LogSymptomModal";
import SymptomHistoryPanel from "./components/SymptomHistoryPanel";
import SymptomTrendsChart, { TrendRange } from "./components/SymptomTrendsChart";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "careconnect.symptomLogs";

function readLogs(): SymptomLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SymptomLog[];
    return parsed.map((l) => ({ ...l, createdAt: Number(l.createdAt) }));
  } catch {
    return [];
  }
}

function writeLogs(logs: SymptomLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function SymptomsScreen() {
  const nav = useNavigate();

  const [logs, setLogs] = useState<SymptomLog[]>(() => readLogs());
  const [range, setRange] = useState<TrendRange>("weekly");
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const todayCount = useMemo(() => {
    const today = startOfDay(Date.now());
    return logs.filter((l) => startOfDay(l.createdAt) === today).length;
  }, [logs]);

  const averageSeverity = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, l) => acc + l.severity, 0);
    return Math.round((sum / logs.length) * 10) / 10;
  }, [logs]);

  const mostCommon = useMemo(() => {
    if (logs.length === 0) return "—";
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.symptom, (counts.get(l.symptom) ?? 0) + 1);
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

  function addLog(newLog: Omit<SymptomLog, "id" | "createdAt">) {
    const log: SymptomLog = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...newLog
    };
    const next = [log, ...logs];
    setLogs(next);
    writeLogs(next);
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="pageTopRow">
            <div>
              <div className="pageTitle">Symptom Tracker</div>
              <div className="pageSub">Monitor and record your symptoms</div>
            </div>

            <button className="btn dark" onClick={() => setShowLogModal(true)}>
              + Log Symptom
            </button>
          </div>

          {/* Stat cards */}
          <div className="statRow">
            <div className="statCard">
              <div className="statIcon blue">〰</div>
              <div>
                <div className="statLabel">Today’s Logs</div>
                <div className="statValue">{todayCount}</div>
              </div>
            </div>

            <div className="statCard">
              <div className="statIcon green">↘</div>
              <div>
                <div className="statLabel">Average Severity</div>
                <div className="statValue">{averageSeverity || "—"}</div>
              </div>
            </div>

            <div className="statCard">
              <div className="statIcon purple">📈</div>
              <div>
                <div className="statLabel">Most Common</div>
                <div className="statValue">{mostCommon}</div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelHeaderRow">
              <div className="panelHeaderLeft">
                <div className="panelIcon purple">📊</div>
                <div>
                  <div className="panelTitle">Symptom Trends</div>
                  <div className="panelSub">Track your symptom severity over time</div>
                </div>
              </div>
            </div>

            <SymptomTrendsChart logs={logs} range={range} onChangeRange={setRange} />
          </div>

          {/* History toggle row */}
          <div className="panel slim" style={{ marginTop: 14 }}>
            <div className="panelHeaderRow">
              <div>
                <div className="panelTitle">Symptom History</div>
                <div className="panelSub">Your recent symptom logs</div>
              </div>

              <button className="btn outline" onClick={() => setShowHistory((s) => !s)}>
                {showHistory ? "Hide History" : "View History"} ▾
              </button>
            </div>
          </div>

          {showHistory && (
            <SymptomHistoryPanel
              logs={logs}
              onDelete={(id) => {
                const next = logs.filter((l) => l.id !== id);
                setLogs(next);
                writeLogs(next);
              }}
              onEdit={(id, patch) => {
                const next = logs.map((l) => (l.id === id ? { ...l, ...patch } : l));
                setLogs(next);
                writeLogs(next);
              }}
            />
          )}
        </div>

        {showLogModal && (
          <LogSymptomModal
            onClose={() => setShowLogModal(false)}
            onSave={(data) => {
              addLog(data);
              setShowLogModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}