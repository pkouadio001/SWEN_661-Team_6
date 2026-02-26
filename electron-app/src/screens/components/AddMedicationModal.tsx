import { useState } from "react";

export type NewMedicationInput = {
  name: string;
  dosage: string;
  times: string; // comma separated
  notes?: string;
};

type Props = {
  onClose: () => void;
  onAdd: (input: NewMedicationInput) => void;
};

export default function AddMedicationModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);

    if (!name.trim()) return setError("Medication name is required.");
    if (!dosage.trim()) return setError("Dosage is required.");
    if (!times.trim()) return setError("At least one time is required (comma separated).");

    onAdd({
      name,
      dosage,
      times,
      notes: notes.trim() || undefined
    });
  }

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="addMedModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="logModalHeader">
          <div>
            <div className="logModalTitle">Add New Medication</div>
            <div className="logModalSub">Enter your medication details below</div>
          </div>
          <button className="xBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <label className="label" style={{ marginTop: 10 }}>Medication Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Carbidopa-Levodopa" />

        <label className="label" style={{ marginTop: 10 }}>Dosage</label>
        <input className="input" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 25-100mg" />

        <label className="label" style={{ marginTop: 10 }}>Times (comma separated)</label>
        <input className="input" value={times} onChange={(e) => setTimes(e.target.value)} placeholder="e.g., 8:00 AM, 2:00 PM" />

        <label className="label" style={{ marginTop: 10 }}>Notes (optional)</label>
        <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Take with food" />

        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}

        <button className="btn addMedBtn" onClick={submit}>
          Add Medication
        </button>
      </div>
    </div>
  );
}