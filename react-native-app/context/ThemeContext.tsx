<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextValue = {
  highContrastMode: boolean;
  setHighContrastMode: (v: boolean) => void;
  resetTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "highContrastMode_v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [highContrastMode, setHighContrastModeState] = useState(false);

  const setHighContrastMode = async (v: boolean) => {
    setHighContrastModeState(v);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {}
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) setHighContrastModeState(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const resetTheme = async () => {
    setHighContrastModeState(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(
    () => ({ highContrastMode, setHighContrastMode, resetTheme }),
    [highContrastMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider />");
  return ctx;
}
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextValue = {
  highContrastMode: boolean;
  setHighContrastMode: (v: boolean) => void;
  resetTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "highContrastMode_v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [highContrastMode, setHighContrastModeState] = useState(false);

  const setHighContrastMode = async (v: boolean) => {
    setHighContrastModeState(v);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {}
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) setHighContrastModeState(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const resetTheme = async () => {
    setHighContrastModeState(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(
    () => ({ highContrastMode, setHighContrastMode, resetTheme }),
    [highContrastMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider />");
  return ctx;
}
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
