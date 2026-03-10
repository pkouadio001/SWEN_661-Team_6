import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UiScale = "small" | "medium" | "large";

type Ctx = {
  scale: UiScale;
  setScale: (s: UiScale) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
};

const UiScaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "careconnect.uiScale";
const HIGH_CONTRAST_STORAGE_KEY = "careconnect.highContrast";

function applyBodyClass(scale: UiScale) {
  document.body.classList.remove("ui-small", "ui-medium", "ui-large");
  document.body.classList.add(`ui-${scale}`);
}

function applyHighContrastClass(enabled: boolean) {
  document.body.classList.toggle("high-contrast", enabled);
}

export function UiScaleProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScaleState] = useState<UiScale>("medium");
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UiScale | null;
    const savedHighContrast = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);

    if (saved === "small" || saved === "medium" || saved === "large") {
      setScaleState(saved);
      applyBodyClass(saved);
    } else {
      applyBodyClass("medium");
    }

    const highContrastEnabled = savedHighContrast === "true";
    setHighContrastState(highContrastEnabled);
    applyHighContrastClass(highContrastEnabled);
  }, []);

  function setScale(s: UiScale) {
    setScaleState(s);
    localStorage.setItem(STORAGE_KEY, s);
    applyBodyClass(s);
  }

  function setHighContrast(enabled: boolean) {
    setHighContrastState(enabled);
    localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(enabled));
    applyHighContrastClass(enabled);
  }

  const value = useMemo(
    () => ({ scale, setScale, highContrast, setHighContrast }),
    [highContrast, scale],
  );
  return <UiScaleContext.Provider value={value}>{children}</UiScaleContext.Provider>;
}

export function useUiScale() {
  const ctx = useContext(UiScaleContext);
  if (!ctx) throw new Error("useUiScale must be used inside UiScaleProvider");
  return ctx;
}