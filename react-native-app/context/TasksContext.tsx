import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: number;
  title: string;
  time: string; // e.g. "Jan 25 at 8:00 AM"
  completed: boolean;
}

interface TasksContextType {
  allTasks: Task[];
  todaysPendingCount: number;
  todaysCompletedCount: number;
  toggleTask: (id: number) => void;
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const STORAGE_KEY = "tasks_v1";

const defaultTasks: Task[] = [
  { id: 1, title: "Take morning medication", time: "Jan 25 at 8:00 AM", completed: true },
  { id: 2, title: "Blood pressure check", time: "Jan 25 at 10:00 AM", completed: false },
  { id: 3, title: "Physical therapy session", time: "Jan 25 at 2:00 PM", completed: false },
  { id: 4, title: "Take evening medication", time: "Jan 25 at 6:00 PM", completed: false },
  { id: 5, title: "Doctor appointment", time: "Jan 26 at 9:00 AM", completed: false },
  { id: 6, title: "Lab work", time: "Jan 27 at 11:00 AM", completed: false },
  { id: 7, title: "Follow-up call", time: "Jan 28 at 2:30 PM", completed: false },
  { id: 8, title: "Medication refill", time: "Jan 30 at 10:00 AM", completed: false },
  { id: 9, title: "Weekly check-in", time: "Jan 30 at 3:00 PM", completed: false },
];

function formatTodayPrefix() {
  // Returns like "Jan 25" in en-US to match your task string format
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTasks, setAllTasks] = useState<Task[]>(defaultTasks);

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const parsed: Omit<Task, "id">[] = JSON.parse(stored);

        setAllTasks((prev) => {
          const nextIdStart = Math.max(...prev.map((t) => t.id), 0) + 1;
          const customTasks: Task[] = parsed.map((t, idx) => ({
            id: nextIdStart + idx,
            ...t,
          }));
          return [...prev, ...customTasks];
        });
      } catch (e) {
        console.error("Error loading tasks:", e);
      }
    })();
  }, []);

  // Save custom tasks to AsyncStorage whenever they change
  useEffect(() => {
    (async () => {
      try {
        const customTasks = allTasks.filter((t) => t.id > defaultTasks.length);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(customTasks.map(({ id, ...rest }) => rest)),
        );
      } catch (e) {
        console.error("Error saving tasks:", e);
      }
    })();
  }, [allTasks]);

  const todayPrefix = useMemo(() => formatTodayPrefix(), []);
  const todaysTasks = useMemo(
    () => allTasks.filter((task) => task.time.startsWith(todayPrefix)),
    [allTasks, todayPrefix],
  );

  const todaysPendingCount = useMemo(
    () => todaysTasks.filter((t) => !t.completed).length,
    [todaysTasks],
  );

  const todaysCompletedCount = useMemo(
    () => todaysTasks.filter((t) => t.completed).length,
    [todaysTasks],
  );

  const toggleTask = (id: number) => {
    setAllTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const addTask = (task: Omit<Task, "id">) => {
    setAllTasks((prev) => {
      const nextId = Math.max(...prev.map((t) => t.id), 0) + 1;
      return [...prev, { id: nextId, ...task }];
    });
  };

  const deleteTask = (id: number) => {
    setAllTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setAllTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const value: TasksContextType = {
    allTasks,
    todaysPendingCount,
    todaysCompletedCount,
    toggleTask,
    addTask,
    deleteTask,
    updateTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within TasksProvider");
  return context;
};
