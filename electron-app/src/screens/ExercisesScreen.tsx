import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ExerciseProgressChart from "./components/ExerciseProgressChart";
import ExerciseInstructionsModal, { Exercise } from "./components/ExerciseInstructionsModal";

type ExerciseWithStatus = Exercise & { completed: boolean };

const STORAGE_KEY = "careconnect.exercises.completed";

const demoExercises: Exercise[] = [
  {
    id: "seated-stretching",
    title: "Seated Stretching",
    description:
      "Gentle stretches to improve flexibility and reduce stiffness. Focus on neck, shoulders, and arms.",
    durationMin: 10,
    difficulty: "Easy",
    overview: "Slow, seated stretches to reduce stiffness and improve range of motion.",
    steps: [
      "Sit upright in a stable chair with feet flat on the floor.",
      "Roll shoulders forward and backward slowly 10 times.",
      "Gently turn your head left/right, holding 3 seconds each side.",
      "Reach one arm overhead and lean slightly to the opposite side.",
      "Breathe slowly and stop if you feel pain."
    ],
    safety: [
      "Move slowly and avoid bouncing.",
      "Stop immediately if you feel pain or dizziness.",
      "Use a stable chair with back support."
    ]
  },
  {
    id: "walking-practice",
    title: "Walking Practice",
    description:
      "Practice walking with proper posture and gait. Use assistive device if needed.",
    durationMin: 20,
    difficulty: "Moderate",
    overview: "Controlled walking practice focusing on posture, stride, and balance.",
    steps: [
      "Choose a safe path with minimal obstacles (hallway or open room).",
      "Stand tall: shoulders relaxed, eyes forward.",
      "Walk heel-to-toe with steady steps, focusing on even stride.",
      "Pause and rest as needed; resume slowly.",
      "Finish with slow breathing and hydration."
    ],
    safety: [
      "Use a wall/rail or caregiver assistance if needed.",
      "Avoid slippery surfaces.",
      "Take breaks if you feel fatigue."
    ]
  },
  {
    id: "balance-exercises",
    title: "Balance Exercises",
    description:
      "Stand on one foot, heel-to-toe walking. Do these near a chair or wall for support.",
    durationMin: 15,
    difficulty: "Moderate",
    overview: "Stand on one foot, heel-to-toe walking. Do these near a chair or wall for support.",
    steps: [
      "Find a comfortable, safe space with support nearby (chair, wall, or railing).",
      "Begin slowly and gently. Focus on your breathing throughout the exercise.",
      "Perform the movements as described: stand on one foot, heel-to-toe walking.",
      "Take breaks as needed. Listen to your body and stop if you feel pain or discomfort.",
      "Complete the exercise for the recommended duration of 15 min."
    ],
    safety: [
      "Always have support nearby in case you lose balance.",
      "Stop immediately if you experience dizziness or pain.",
      "Exercise when your medication is working at its best.",
      "Consult your healthcare provider before starting new exercises."
    ]
  },
  {
    id: "hand-finger",
    title: "Hand & Finger Exercises",
    description:
      "Finger taps, grip exercises, and fine motor skill practice to maintain dexterity.",
    durationMin: 10,
    difficulty: "Easy",
    overview: "Fine motor exercises to maintain dexterity and hand strength.",
    steps: [
      "Perform finger taps (thumb to each finger) 10 times per hand.",
      "Open/close fists slowly 10 times.",
      "Squeeze a soft ball gently 10 times per hand.",
      "Stretch fingers wide and relax."
    ],
    safety: ["Avoid over-squeezing if you feel pain.", "Rest hands if they cramp."]
  },
  {
    id: "speech-exercises",
    title: "Speech Exercises",
    description: "Vocal exercises and reading aloud to maintain speech clarity and volume.",
    durationMin: 15,
    difficulty: "Easy",
    overview: "Practice vocal volume and articulation to support speech clarity.",
    steps: [
      "Take a deep breath and say a sentence clearly at a comfortable volume.",
      "Repeat with slightly increased volume (no strain).",
      "Read a short paragraph aloud, focusing on articulation.",
      "Rest and hydrate."
    ],
    safety: ["Stop if you feel throat strain.", "Hydrate before and after."]
  },
  {
    id: "tai-chi",
    title: "Tai Chi Practice",
    description: "Slow, flowing movements to improve balance, flexibility, and overall well-being.",
    durationMin: 30,
    difficulty: "Challenging",
    overview: "Slow flowing movements to enhance balance and body awareness.",
    steps: [
      "Stand with feet shoulder-width apart and knees soft.",
      "Move arms slowly in controlled patterns while shifting weight.",
      "Focus on steady breathing and posture.",
      "Take breaks as needed."
    ],
    safety: ["Use support nearby.", "Stop if you feel dizzy.", "Go slowly."]
  }
];

function readCompleted(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function writeCompleted(map: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export default function ExercisesScreen() {
  const nav = useNavigate();
  const [active, setActive] = useState<Exercise | null>(null);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => readCompleted());

  const exercises: ExerciseWithStatus[] = useMemo(() => {
    return demoExercises.map((e) => ({ ...e, completed: !!completedMap[e.id] }));
  }, [completedMap]);

  const completedCount = exercises.filter((e) => e.completed).length;

  function startExercise(exerciseId: string) {
    const next = { ...completedMap, [exerciseId]: true };
    setCompletedMap(next);
    writeCompleted(next);
    setActive(null);
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="pageTitle">Exercise Plan</div>
          <div className="pageSub">Daily exercises to manage Parkinson&apos;s symptoms</div>

          <div className="grid2" style={{ marginTop: 14 }}>
            <div className="panel">
              <div className="panelTitle">Today&apos;s Progress</div>
              <div className="panelSub">Completed</div>

              <div className="progressRow">
                <div className="progressBar">
                  <div
                    className="progressFill"
                    style={{
                      width: `${(completedCount / exercises.length) * 100}%`
                    }}
                  />
                </div>
                <div className="progressCount">
                  {completedCount} / {exercises.length}
                </div>
              </div>

              <div className="panelSub" style={{ marginTop: 8 }}>
                {Math.round((completedCount / exercises.length) * 100)}% of exercises completed
              </div>
            </div>

            <div className="panel">
                <ExerciseProgressChart />
            </div>
          </div>

          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelTitle">Your Exercise Routine</div>
            <div className="panelSub">
              Complete these exercises throughout the day. Take breaks as needed.
            </div>

            <div className="exerciseList">
              {exercises.map((e) => (
                <div key={e.id} className={`exerciseCard ${e.completed ? "completed" : ""}`}>
                  <div className={`exerciseIcon ${e.completed ? "done" : ""}`}>
                    {e.completed ? "✓" : "✦"}
                  </div>

                  <div className="exerciseMain">
                    <div className="exerciseTitle">{e.title}</div>
                    <div className="exerciseDesc">{e.description}</div>

                    {e.completed ? (
                      <div className="exerciseDoneLine">✓ Completed</div>
                    ) : (
                      <div className="exerciseButtons">
                        <button className="btn" onClick={() => startExercise(e.id)}>
                          ▶ Start Exercise
                        </button>
                        <button className="btn outline" onClick={() => setActive(e)}>
                          View Instructions
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="exerciseMeta">
                    <span className={`pill ${e.difficulty.toLowerCase()}`}>{e.difficulty}</span>
                    <span className="pill neutral">🕒 {e.durationMin} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

         

          <div className="panel tipsPanel" style={{ marginTop: 14 }}>
            <div className="panelTitle">Exercise Tips</div>
            <ul className="tipsList">
              <li>Exercise at times when your medication is working at its best</li>
              <li>Start slowly and gradually increase intensity</li>
              <li>Use assistive devices when needed for safety</li>
              <li>Take breaks between exercises - listen to your body</li>
            </ul>
          </div>
        </div>
      </div>

      {active && (
        <ExerciseInstructionsModal
          exercise={active}
          onClose={() => setActive(null)}
          onStart={startExercise}
        />
      )}
    </div>
  );
}