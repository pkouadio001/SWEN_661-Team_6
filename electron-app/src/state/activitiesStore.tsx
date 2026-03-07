import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type Activity = {
  id: string;
  title: string;
  time?: string; // e.g. "8:00 AM"
  completed: boolean;
};

type State = {
  activities: Activity[];
};

type Action =
  | { type: "ADD"; payload: Activity }
  | { type: "TOGGLE"; id: string }
  | { type: "DELETE"; id: string }
  | { type: "UPDATE"; id: string; patch: Partial<Omit<Activity, "id">> }
  | { type: "SET_ALL"; payload: Activity[] };

const STORAGE_KEY = "careconnect.activities.v1";

const initialSeed: Activity[] = [
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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, activities: action.payload };
    case "ADD":
      return { ...state, activities: [action.payload, ...state.activities] };
    case "TOGGLE":
      return {
        ...state,
        activities: state.activities.map((a) =>
          a.id === action.id ? { ...a, completed: !a.completed } : a
        ),
      };
    case "DELETE":
      return { ...state, activities: state.activities.filter((a) => a.id !== action.id) };
    case "UPDATE":
      return {
        ...state,
        activities: state.activities.map((a) =>
          a.id === action.id ? { ...a, ...action.patch } : a
        ),
      };
    default:
      return state;
  }
}

type Ctx = {
  activities: Activity[];
  addActivity: (title: string, time?: string) => void;
  toggleActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
  updateActivity: (id: string, patch: Partial<Omit<Activity, "id">>) => void;
};

const ActivitiesContext = createContext<Ctx | null>(null);

function loadFromStorage(): Activity[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Activity[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { activities: initialSeed });

  // load once
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.length) dispatch({ type: "SET_ALL", payload: saved });
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.activities));
    } catch {
      // ignore storage failures
    }
  }, [state.activities]);

  const value = useMemo<Ctx>(() => {
    return {
      activities: state.activities,
      addActivity: (title, time) => {
        const trimmed = title.trim();
        if (!trimmed) return;
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

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error("useActivities must be used within ActivitiesProvider");
  return ctx;
}