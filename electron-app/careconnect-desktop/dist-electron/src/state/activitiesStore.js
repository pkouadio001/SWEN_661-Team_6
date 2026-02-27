"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesProvider = ActivitiesProvider;
exports.useActivities = useActivities;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const STORAGE_KEY = "careconnect.activities.v1";
const initialSeed = [
    { id: "a1", title: "Morning Stretches", time: "8:00 AM", completed: true },
    { id: "a2", title: "Take Morning Medications", time: "8:00 AM", completed: true },
    { id: "a3", title: "Breakfast", time: "8:30 AM", completed: true },
    { id: "a4", title: "Physical Therapy Exercises", time: "10:00 AM", completed: false },
    { id: "a5", title: "Lunch", time: "12:00 PM", completed: false },
    { id: "a6", title: "Take Afternoon Medications", time: "2:00 PM", completed: false },
    { id: "a7", title: "Video Call with Family", time: "3:00 PM", completed: false },
    { id: "a8", title: "Evening Walk", time: "5:00 PM", completed: false },
    { id: "a9", title: "Dinner", time: "6:00 PM", completed: false },
    { id: "a10", title: "Take Evening Medications", time: "8:00 PM", completed: false },
];
function reducer(state, action) {
    switch (action.type) {
        case "SET_ALL":
            return { ...state, activities: action.payload };
        case "ADD":
            return { ...state, activities: [action.payload, ...state.activities] };
        case "TOGGLE":
            return {
                ...state,
                activities: state.activities.map((a) => a.id === action.id ? { ...a, completed: !a.completed } : a),
            };
        case "DELETE":
            return { ...state, activities: state.activities.filter((a) => a.id !== action.id) };
        case "UPDATE":
            return {
                ...state,
                activities: state.activities.map((a) => a.id === action.id ? { ...a, ...action.patch } : a),
            };
        default:
            return state;
    }
}
const ActivitiesContext = (0, react_1.createContext)(null);
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
function ActivitiesProvider({ children }) {
    const [state, dispatch] = (0, react_1.useReducer)(reducer, { activities: initialSeed });
    // load once
    (0, react_1.useEffect)(() => {
        const saved = loadFromStorage();
        if (saved && saved.length)
            dispatch({ type: "SET_ALL", payload: saved });
    }, []);
    // persist
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.activities));
        }
        catch {
            // ignore storage failures
        }
    }, [state.activities]);
    const value = (0, react_1.useMemo)(() => {
        return {
            activities: state.activities,
            addActivity: (title, time) => {
                const trimmed = title.trim();
                if (!trimmed)
                    return;
                dispatch({
                    type: "ADD",
                    payload: { id: crypto.randomUUID(), title: trimmed, time: time?.trim() || undefined, completed: false },
                });
            },
            toggleActivity: (id) => dispatch({ type: "TOGGLE", id }),
            deleteActivity: (id) => dispatch({ type: "DELETE", id }),
            updateActivity: (id, patch) => dispatch({ type: "UPDATE", id, patch }),
        };
    }, [state.activities]);
    return (0, jsx_runtime_1.jsx)(ActivitiesContext.Provider, { value: value, children: children });
}
function useActivities() {
    const ctx = (0, react_1.useContext)(ActivitiesContext);
    if (!ctx)
        throw new Error("useActivities must be used within ActivitiesProvider");
    return ctx;
}
