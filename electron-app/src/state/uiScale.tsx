import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UiScale = "small" | "medium" | "large";

type Ctx = {
  scale: UiScale;
  setScale: (s: UiScale) => void;
};

const UiScaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "careconnect.uiScale";

function applyBodyClass(scale: UiScale) {
  document.body.classList.remove("ui-small", "ui-medium", "ui-large");
  document.body.classList.add(`ui-${scale}`);
}

export function UiScaleProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScaleState] = useState<UiScale>("medium");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UiScale | null;
    if (saved === "small" || saved === "medium" || saved === "large") {
      setScaleState(saved);
      applyBodyClass(saved);
    } else {
      applyBodyClass("medium");
    }
  }, []);

  function setScale(s: UiScale) {
    setScaleState(s);
    localStorage.setItem(STORAGE_KEY, s);
    applyBodyClass(s);
  }

  const value = useMemo(() => ({ scale, setScale }), [scale]);
  return <UiScaleContext.Provider value={value}>{children}</UiScaleContext.Provider>;
}

export function useUiScale() {
  const ctx = useContext(UiScaleContext);
  if (!ctx) throw new Error("useUiScale must be used inside UiScaleProvider");
  return ctx;
}