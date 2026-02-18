import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface HealthEntry {
  id: number;
  type: string;
  category: "vital" | "mood" | "symptoms" | "meals";
  date: string;
  time: string;
  value: string;
  icon: string;
}

interface HealthLogsContextType {
  allEntries: HealthEntry[];
  addEntry: (entry: Omit<HealthEntry, "id">) => void;
  deleteEntry: (id: number) => void;
  updateEntry: (id: number, updates: Partial<HealthEntry>) => void;
  isReady: boolean;
}

const HealthLogsContext = createContext<HealthLogsContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "healthEntries_v1";

// Keep your defaults as-is
const defaultEntries: HealthEntry[] = [
  {
    id: 1,
    type: "Blood Pressure",
    category: "vital",
    date: "Jan 25, 2026",
    time: "9:00 AM",
    value: "120/80",
    icon: "vital",
  },
  {
    id: 2,
    type: "Heart Rate",
    category: "vital",
    date: "Jan 25, 2026",
    time: "9:00 AM",
    value: "72 bpm",
    icon: "vital",
  },
  {
    id: 3,
    type: "Mood: 😊 Happy",
    category: "mood",
    date: "Jan 25, 2026",
    time: "2:30 PM",
    value: "😊 Happy",
    icon: "mood",
  },
  {
    id: 4,
    type: "Blood Pressure",
    category: "vital",
    date: "Jan 24, 2026",
    time: "9:15 AM",
    value: "118/78",
    icon: "vital",
  },
  {
    id: 5,
    type: "Temperature",
    category: "vital",
    date: "Jan 24, 2026",
    time: "8:30 AM",
    value: "98.6°F",
    icon: "vital",
  },
  {
    id: 6,
    type: "Symptoms: Mild Headache",
    category: "symptoms",
    date: "Jan 24, 2026",
    time: "1:00 PM",
    value: "Mild",
    icon: "symptoms",
  },
  {
    id: 7,
    type: "Blood Sugar",
    category: "vital",
    date: "Jan 24, 2026",
    time: "7:00 AM",
    value: "105 mg/dL",
    icon: "vital",
  },
  {
    id: 8,
    type: "Lunch: Salad & Grilled Chicken",
    category: "meals",
    date: "Jan 25, 2026",
    time: "12:00 PM",
    value: "~450 cal",
    icon: "meals",
  },
  {
    id: 9,
    type: "Blood Pressure",
    category: "vital",
    date: "Jan 23, 2026",
    time: "9:00 AM",
    value: "122/82",
    icon: "vital",
  },
  {
    id: 10,
    type: "Heart Rate",
    category: "vital",
    date: "Jan 23, 2026",
    time: "8:45 AM",
    value: "68 bpm",
    icon: "vital",
  },
  {
    id: 11,
    type: "Temperature",
    category: "vital",
    date: "Jan 22, 2026",
    time: "8:00 AM",
    value: "98.4°F",
    icon: "vital",
  },
  {
    id: 12,
    type: "Blood Sugar",
    category: "vital",
    date: "Jan 22, 2026",
    time: "7:30 AM",
    value: "102 mg/dL",
    icon: "vital",
  },
  {
    id: 13,
    type: "Blood Pressure",
    category: "vital",
    date: "Jan 21, 2026",
    time: "9:00 AM",
    value: "119/79",
    icon: "vital",
  },
  {
    id: 14,
    type: "Heart Rate",
    category: "vital",
    date: "Jan 21, 2026",
    time: "9:00 AM",
    value: "70 bpm",
    icon: "vital",
  },
  {
    id: 15,
    type: "Weight",
    category: "vital",
    date: "Jan 20, 2026",
    time: "7:00 AM",
    value: "165 lbs",
    icon: "vital",
  },
];

type StoredEntry = Omit<HealthEntry, "id">;

export const HealthLogsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customEntries, setCustomEntries] = useState<HealthEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load custom entries once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed: StoredEntry[] = JSON.parse(raw);

        // Rebuild ids so they never collide with defaults
        const rebuilt: HealthEntry[] = parsed.map((entry, idx) => ({
          id: defaultEntries.length + idx + 1,
          ...entry,
        }));

        setCustomEntries(rebuilt);
      } catch (e) {
        console.warn("Error loading health entries from storage:", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Save whenever custom entries change (after initial load)
  useEffect(() => {
    if (!isReady) return;

    (async () => {
      try {
        const toStore: StoredEntry[] = customEntries.map(
          ({ id, ...rest }) => rest,
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch (e) {
        console.warn("Error saving health entries to storage:", e);
      }
    })();
  }, [customEntries, isReady]);

  const allEntries = useMemo(
    () => [...defaultEntries, ...customEntries],
    [customEntries],
  );

  const addEntry = (entry: Omit<HealthEntry, "id">) => {
    const maxId = Math.max(
      defaultEntries.length,
      ...customEntries.map((e) => e.id),
      0,
    );
    const newId = maxId + 1;
    setCustomEntries((prev) => [...prev, { ...entry, id: newId }]);
  };

  const deleteEntry = (id: number) => {
    // Only allow deleting custom entries; defaults are “seed data”
    if (id <= defaultEntries.length) return;
    setCustomEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id: number, updates: Partial<HealthEntry>) => {
    if (id <= defaultEntries.length) return;
    setCustomEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  };

  return (
    <HealthLogsContext.Provider
      value={{ allEntries, addEntry, deleteEntry, updateEntry, isReady }}
    >
      {children}
    </HealthLogsContext.Provider>
  );
};

export const useHealthLogs = () => {
  const ctx = useContext(HealthLogsContext);
  if (!ctx)
    throw new Error("useHealthLogs must be used within HealthLogsProvider");
  return ctx;
};
