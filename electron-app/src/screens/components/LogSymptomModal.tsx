import { useMemo, useState } from "react";

export type SymptomType =
  | "Tremor - Right Hand"
  | "Tremor - Left Hand"
  | "Stiffness"
  | "Balance Issues"
  | "Fatigue"
  | "Slowness of Movement";

export type SymptomLog = {
  id: string;
  createdAt: number; // epoch ms
  symptom: SymptomType;
  severity: number; // 1..5
  notes?: string;
};

type Props = {
  onClose: () => void;
  onSave: (data: Omit<SymptomLog, "id" | "createdAt">) => void;
};

const symptomOptions: SymptomType[] = [
  "Tremor - Right Hand",
  "Tremor - Left Hand",
  "Stiffness",
  "Balance Issues",
  "Fatigue",
  "Slowness of Movement"
];

function severityLabel(v: number) {
  if (v <= 2) return "Mild";
  if (v === 3) return "Moderate";
  return "Severe";
}

export default function LogSymptomModal({ onClose, onSave }: Props) {
  const [symptom, setSymptom] = useState<SymptomType>("Tremor - Right Hand");
  const [severity, setSeverity] = useState<number>(3);
  const [notes, setNotes] = useState("");

  const sevText = useMemo(() => `Severity: ${severityLabel(severity)} (${severity}/5)`, [severity]);

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Log New Symptom">
      <div className="modalCard">
        <div className="modalHeader">
          <div>
            <div className="modalTitle">Log New Symptom</div>
            <div className="modalSub">Record how you’re feeling right now</div>
          </div>
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modalBody">
          <div className="modalSectionTitle">Select Symptom</div>
          <div className="chipGrid">
            {symptomOptions.map((s) => (
              <button
                key={s}
                className={`selectChip ${s === symptom ? "active" : ""}`}
                onClick={() => setSymptom(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="modalSectionTitle">{sevText}</div>
            <div className="sliderRow">
              <span className="muted">Very Mild</span>
              <input
                className="slider"
                type="range"
                min={1}
                max={5}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                aria-label="Severity"
              />
              <span className="muted">Severe</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="modalSectionTitle">Additional Notes (optional)</div>
            <textarea
              className="textarea"
              value={notes}
              placeholder="Any additional details..."
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="modalFooter">
          <button
            className="btn full muted"
            onClick={() =>
              onSave({
                symptom,
                severity,
                notes: notes.trim() ? notes.trim() : undefined
              })
            }
          >
            Save Symptom Log
          </button>
        </div>
      </div>
    </div>
  );
}