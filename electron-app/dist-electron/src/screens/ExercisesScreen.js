"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExercisesScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const ExerciseProgressChart_1 = __importDefault(require("./components/ExerciseProgressChart"));
const ExerciseInstructionsModal_1 = __importDefault(require("./components/ExerciseInstructionsModal"));
const STORAGE_KEY = "careconnect.exercises.completed";
const demoExercises = [
    {
        id: "seated-stretching",
        title: "Seated Stretching",
        description: "Gentle stretches to improve flexibility and reduce stiffness. Focus on neck, shoulders, and arms.",
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
        description: "Practice walking with proper posture and gait. Use assistive device if needed.",
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
        description: "Stand on one foot, heel-to-toe walking. Do these near a chair or wall for support.",
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
        description: "Finger taps, grip exercises, and fine motor skill practice to maintain dexterity.",
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
function readCompleted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return {};
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
function writeCompleted(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
function ExercisesScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    const [active, setActive] = (0, react_1.useState)(null);
    const [completedMap, setCompletedMap] = (0, react_1.useState)(() => readCompleted());
    const exercises = (0, react_1.useMemo)(() => {
        return demoExercises.map((e) => ({ ...e, completed: !!completedMap[e.id] }));
    }, [completedMap]);
    const completedCount = exercises.filter((e) => e.completed).length;
    function startExercise(exerciseId) {
        const next = { ...completedMap, [exerciseId]: true };
        setCompletedMap(next);
        writeCompleted(next);
        setActive(null);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "Exercise Plan" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Daily exercises to manage Parkinson's symptoms" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid2", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Today's Progress" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Completed" }), (0, jsx_runtime_1.jsxs)("div", { className: "progressRow", children: [(0, jsx_runtime_1.jsx)("div", { className: "progressBar", children: (0, jsx_runtime_1.jsx)("div", { className: "progressFill", style: {
                                                                width: `${(completedCount / exercises.length) * 100}%`
                                                            } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "progressCount", children: [completedCount, " / ", exercises.length] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panelSub", style: { marginTop: 8 }, children: [Math.round((completedCount / exercises.length) * 100), "% of exercises completed"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "panel", children: (0, jsx_runtime_1.jsx)(ExerciseProgressChart_1.default, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Your Exercise Routine" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Complete these exercises throughout the day. Take breaks as needed." }), (0, jsx_runtime_1.jsx)("div", { className: "exerciseList", children: exercises.map((e) => ((0, jsx_runtime_1.jsxs)("div", { className: `exerciseCard ${e.completed ? "completed" : ""}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `exerciseIcon ${e.completed ? "done" : ""}`, children: e.completed ? "✓" : "✦" }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseMain", children: [(0, jsx_runtime_1.jsx)("div", { className: "exerciseTitle", children: e.title }), (0, jsx_runtime_1.jsx)("div", { className: "exerciseDesc", children: e.description }), e.completed ? ((0, jsx_runtime_1.jsx)("div", { className: "exerciseDoneLine", children: "\u2713 Completed" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "exerciseButtons", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => startExercise(e.id), children: "\u25B6 Start Exercise" }), (0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: () => setActive(e), children: "View Instructions" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "exerciseMeta", children: [(0, jsx_runtime_1.jsx)("span", { className: `pill ${e.difficulty.toLowerCase()}`, children: e.difficulty }), (0, jsx_runtime_1.jsxs)("span", { className: "pill neutral", children: ["\uD83D\uDD52 ", e.durationMin, " min"] })] })] }, e.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel tipsPanel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Exercise Tips" }), (0, jsx_runtime_1.jsxs)("ul", { className: "tipsList", children: [(0, jsx_runtime_1.jsx)("li", { children: "Exercise at times when your medication is working at its best" }), (0, jsx_runtime_1.jsx)("li", { children: "Start slowly and gradually increase intensity" }), (0, jsx_runtime_1.jsx)("li", { children: "Use assistive devices when needed for safety" }), (0, jsx_runtime_1.jsx)("li", { children: "Take breaks between exercises - listen to your body" })] })] })] })] }), active && ((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: active, onClose: () => setActive(null), onStart: startExercise }))] }));
}
