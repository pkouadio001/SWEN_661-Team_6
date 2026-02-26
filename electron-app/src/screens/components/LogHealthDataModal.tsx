import { useMemo, useState } from "react";

export type HealthLogInput =
  | {
      type: "bloodPressure";
      systolic: number;
      diastolic: number;
      pulse?: number;
      notes?: string;
    }
  | {
      type: "mood";
      feeling: string;          // e.g., "Happy"
      moodLevel: number;        // 1..5
      notes?: string;
    }
  | {
      type: "meal";
      mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
      description: string;
      calories?: number;
      notes?: string;
    };

type Props = {
  onClose: () => void;
  onSave: (input: HealthLogInput) => void;
};

type Tab = "bloodPressure" | "mood" | "meal";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function moodLabel(level: number) {
  // level 1..5
  if (level <= 1) return "Very Low";
  if (level === 2) return "Low";
  if (level === 3) return "Moderate";
  if (level === 4) return "Good";
  return "Excellent";
}

export default function LogHealthDataModal({ onClose, onSave }: Props) {
  const [tab, setTab] = useState<Tab>("bloodPressure");

  // Blood Pressure
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [pulse, setPulse] = useState("70");

  // Mood
  const feelings = useMemo(
    () => ["Happy", "Calm", "Anxious", "Energetic", "Tired", "Content"],
    []
  );
  const [feeling, setFeeling] = useState<string>("Happy");
  const [moodLevel, setMoodLevel] = useState<number>(3); // 1..5

  // Meal
  const [mealType, setMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [mealDesc, setMealDesc] = useState("");
  const [calories, setCalories] = useState("");

  // Shared
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function parseIntSafe(v: string) {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }

  function validateAndSave() {
    setError(null);

    if (tab === "bloodPressure") {
      const s = parseIntSafe(systolic);
      const d = parseIntSafe(diastolic);
      const p = pulse.trim() ? parseIntSafe(pulse) : null;

      if (s === null || s < 50 || s > 250) return setError("Enter a valid systolic value.");
      if (d === null || d < 30 || d > 160) return setError("Enter a valid diastolic value.");
      if (p !== null && (p < 30 || p > 220)) return setError("Enter a valid pulse value (or leave blank).");

      onSave({
        type: "bloodPressure",
        systolic: s,
        diastolic: d,
        pulse: p ?? undefined,
        notes: notes.trim() || undefined
      });
      return;
    }

    if (tab === "mood") {
      const lvl = clamp(moodLevel, 1, 5);
      onSave({
        type: "mood",
        feeling,
        moodLevel: lvl,
        notes: notes.trim() || undefined
      });
      return;
    }

    // meal
    if (!mealDesc.trim()) return setError("Please describe what you ate.");
    const c = calories.trim() ? parseIntSafe(calories) : null;
    if (c !== null && (c < 0 || c > 10000)) return setError("Enter a valid calories number (or leave blank).");

    onSave({
      type: "meal",
      mealType,
      description: mealDesc.trim(),
      calories: c ?? undefined,
      notes: notes.trim() || undefined
    });
  }

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="logModalV2" onMouseDown={(e) => e.stopPropagation()}>
        <div className="logModalHeader">
          <div>
            <div className="logModalTitle">Log Health Data</div>
            <div className="logModalSub">Record your health information</div>
          </div>
          <button className="xBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="logSectionTitle">What would you like to log?</div>

        <div className="logTabsV2">
          <button className={`logTab ${tab === "bloodPressure" ? "active" : ""}`} onClick={() => setTab("bloodPressure")}>
            ♡ <div>Blood Pressure</div>
          </button>
          <button className={`logTab ${tab === "mood" ? "active" : ""}`} onClick={() => setTab("mood")}>
            ◉ <div>Mood</div>
          </button>
          <button className={`logTab ${tab === "meal" ? "active" : ""}`} onClick={() => setTab("meal")}>
            🍏 <div>Meal</div>
          </button>
        </div>

        {/* ---------- Blood Pressure ---------- */}
        {tab === "bloodPressure" && (
          <>
            <div className="twoCol" style={{ marginTop: 10 }}>
              <div>
                <label className="label">Systolic (top)</label>
                <input className="input" value={systolic} onChange={(e) => setSystolic(e.target.value)} inputMode="numeric" />
              </div>
              <div>
                <label className="label">Diastolic (bottom)</label>
                <input className="input" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} inputMode="numeric" />
              </div>
            </div>

            <label className="label" style={{ marginTop: 10 }}>Pulse (optional)</label>
            <input className="input" value={pulse} onChange={(e) => setPulse(e.target.value)} inputMode="numeric" />

            <label className="label" style={{ marginTop: 10 }}>Additional Notes (optional)</label>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional details..." />
          </>
        )}

        {/* ---------- Mood ---------- */}
        {tab === "mood" && (
          <>
            <div className="logSectionTitle" style={{ marginTop: 10 }}>How are you feeling?</div>

            <div className="feelingGrid">
              {feelings.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`feelingBtn ${feeling === f ? "active" : ""}`}
                  onClick={() => setFeeling(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="moodSliderHeader">
              <div className="moodSliderLabel">
                Mood Level: <strong>{moodLabel(moodLevel)} ({moodLevel}/5)</strong>
              </div>
            </div>

            <input
              className="moodSlider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={moodLevel}
              onChange={(e) => setMoodLevel(Number(e.target.value))}
            />

            <div className="moodScale">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>

            <label className="label" style={{ marginTop: 10 }}>Additional Notes (optional)</label>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional details..." />
          </>
        )}

        {/* ---------- Meal ---------- */}
        {tab === "meal" && (
          <>
            <label className="label" style={{ marginTop: 10 }}>Meal Type</label>

            <div className="mealGrid">
              {(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`mealBtn ${mealType === t ? "active" : ""}`}
                  onClick={() => setMealType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <label className="label" style={{ marginTop: 10 }}>What did you eat?</label>
            <textarea className="textarea" value={mealDesc} onChange={(e) => setMealDesc(e.target.value)} placeholder="Describe your meal..." />

            <label className="label" style={{ marginTop: 10 }}>Calories (optional)</label>
            <input className="input" value={calories} onChange={(e) => setCalories(e.target.value)} inputMode="numeric" placeholder="Enter calories..." />

            <label className="label" style={{ marginTop: 10 }}>Additional Notes (optional)</label>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional details..." />
          </>
        )}

        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}

        <button className="btn logSaveBtn" onClick={validateAndSave}>
          Save Health Log
        </button>
      </div>
    </div>
  );
}