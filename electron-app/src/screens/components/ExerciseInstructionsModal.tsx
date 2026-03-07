import { useEffect } from "react";

export type Exercise = {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  overview: string;
  steps: string[];
  safety: string[];
};

type Props = {
  exercise: Exercise;
  onClose: () => void;
  onStart: (exerciseId: string) => void;
};

export default function ExerciseInstructionsModal({ exercise, onClose, onStart }: Props) {
  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modalOverlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="exerciseModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="exerciseModalHeader">
          <div className="exerciseModalTitleRow">
            <div className="exerciseModalIcon">🏃</div>
            <div>
              <div className="exerciseModalTitle">{exercise.title}</div>
              <div className="exerciseModalSub">
                Follow these instructions carefully to perform the exercise safely and effectively.
              </div>
            </div>
          </div>

          <button className="xBtn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="exerciseMetaRow">
          <span className="pill neutral">🕒 {exercise.durationMin} min</span>
          <span className={`pill ${exercise.difficulty.toLowerCase()}`}>{exercise.difficulty}</span>
        </div>

        <div className="exerciseSection infoBox">
          <div className="sectionTitle">Overview</div>
          <div className="sectionText">{exercise.overview}</div>
        </div>

        <div className="exerciseSection">
          <div className="sectionTitle">Step-by-Step Instructions</div>
          <ol className="stepsList">
            {exercise.steps.map((s, i) => (
              <li key={i} className="stepItem">
                <span className="stepNum">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="exerciseSection safetyBox">
          <div className="sectionTitle">⚠ Safety Reminders</div>
          <ul className="safetyList">
            {exercise.safety.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="exerciseModalFooter">
          <button className="btn outline" onClick={onClose}>
            Close
          </button>

          <button className="btn" onClick={() => onStart(exercise.id)}>
            ▶ Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
}