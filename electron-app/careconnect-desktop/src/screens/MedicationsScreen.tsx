import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddMedicationModal, { NewMedicationInput } from "./components/AddMedicationModal";

type DoseStatus = "taken" | "due" | "missed" | "upcoming";

type DoseTime = {
  id: string;
  timeLabel: string; // "8:00 AM"
  status: DoseStatus;
};

type Medication = {
  id: string;
  name: string;
  dosage: string;
  note?: string;
  doses: DoseTime[];
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function MedicationsScreen() {
  const nav = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  // Demo data (matches your screenshot vibe)
  const [meds, setMeds] = useState<Medication[]>([
    {
      id: uid(),
      name: "Carbidopa-Levodopa",
      dosage: "25-100mg",
      note: "Take with food",
      doses: [
        { id: uid(), timeLabel: "8:00 AM", status: "taken" },
        { id: uid(), timeLabel: "2:00 PM", status: "due" },
        { id: uid(), timeLabel: "8:00 PM", status: "upcoming" }
      ]
    },
    {
      id: uid(),
      name: "Amantadine",
      dosage: "100mg",
      note: "May cause dizziness",
      doses: [
        { id: uid(), timeLabel: "10:00 AM", status: "taken" },
        { id: uid(), timeLabel: "6:00 PM", status: "upcoming" }
      ]
    },
    {
      id: uid(),
      name: "Pramipexole",
      dosage: "0.25mg",
      note: "Take at same time daily",
      doses: [
        { id: uid(), timeLabel: "9:00 AM", status: "upcoming" },
        { id: uid(), timeLabel: "9:00 PM", status: "upcoming" }
      ]
    }
  ]);

  const subtitle = useMemo(() => "Keep track of your daily medications", []);

  function toggleTaken(medId: string, doseId: string) {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m;
        return {
          ...m,
          doses: m.doses.map((d) => {
            if (d.id !== doseId) return d;
            // Toggle between taken and due (simple)
            const next: DoseStatus = d.status === "taken" ? "due" : "taken";
            return { ...d, status: next };
          })
        };
      })
    );
  }

  function removeMedication(medId: string) {
    setMeds((prev) => prev.filter((m) => m.id !== medId));
  }

  function addMedication(input: NewMedicationInput) {
    const times = input.times
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const doses: DoseTime[] =
      times.length > 0
        ? times.map((t, idx) => ({
            id: uid(),
            timeLabel: t,
            status: idx === 0 ? "due" : "upcoming"
          }))
        : [{ id: uid(), timeLabel: "8:00 AM", status: "due" }];

    const next: Medication = {
      id: uid(),
      name: input.name.trim(),
      dosage: input.dosage.trim(),
      note: input.notes?.trim() || undefined,
      doses
    };

    setMeds((prev) => [next, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="medHeader">
            <div>
              <div className="pageTitle">Medication Tracker</div>
              <div className="pageSub">{subtitle}</div>
            </div>

            <button className="btn medAddBtn" onClick={() => setShowAdd(true)}>
              +&nbsp; Add Medication
            </button>
          </div>

          <div className="medList">
            {meds.map((m) => (
              <div key={m.id} className="medCard">
                <div className="medCardTop">
                  <div className="medTitleRow">
                    <div className="medIcon">✎</div>
                    <div>
                      <div className="medName">{m.name}</div>
                      <div className="medDose">{m.dosage}</div>
                    </div>
                  </div>

                  <div className="medActions">
                    <button className="iconBtn" title="Edit (not implemented)">✎</button>
                    <button className="iconBtn danger" title="Delete" onClick={() => removeMedication(m.id)}>
                      🗑
                    </button>
                  </div>
                </div>

                {m.note && <div className="medNote">ⓘ&nbsp; {m.note}</div>}

                <div className="doseList">
                  {m.doses.map((d) => (
                    <div key={d.id} className={`doseRow ${d.status}`}>
                      <label className="doseLeft">
                        <input
                          type="checkbox"
                          checked={d.status === "taken"}
                          onChange={() => toggleTaken(m.id, d.id)}
                        />
                        <span className="doseTime">🕒&nbsp; {d.timeLabel}</span>
                      </label>

                      <div className={`doseStatus ${d.status}`}>
                        {d.status === "taken" && "✓ Taken"}
                        {d.status === "due" && "⏱ Due Now"}
                        {d.status === "missed" && "⛔ Missed"}
                        {d.status === "upcoming" && ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddMedicationModal onClose={() => setShowAdd(false)} onAdd={addMedication} />}
    </div>
  );
}