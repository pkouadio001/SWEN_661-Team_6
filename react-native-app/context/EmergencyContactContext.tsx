import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface EmergencyContactData {
  name: string;
  phone: string;
}

interface EmergencyContactContextType {
  emergencyContactData: EmergencyContactData;
  setEmergencyContactData: (data: EmergencyContactData) => void;
  isEmergencyContactReady: boolean; // optional, like ThemeContext "ready" flag
}

const STORAGE_KEY = "emergencyContactData_v1";

const DEFAULT_CONTACT: EmergencyContactData = {
  name: "Caregiver Maria",
  phone: "5550123456",
};

const EmergencyContactContext = createContext<EmergencyContactContextType | undefined>(
  undefined,
);

export const EmergencyContactProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [emergencyContactData, setEmergencyContactDataState] =
    useState<EmergencyContactData>(DEFAULT_CONTACT);
  const [isEmergencyContactReady, setIsEmergencyContactReady] = useState(false);

  // Load once
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // basic shape guard
          if (
            parsed &&
            typeof parsed.name === "string" &&
            typeof parsed.phone === "string"
          ) {
            setEmergencyContactDataState(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to load emergency contact:", e);
      } finally {
        setIsEmergencyContactReady(true);
      }
    })();
  }, []);

  const setEmergencyContactData = (data: EmergencyContactData) => {
    setEmergencyContactDataState(data);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch((e) =>
      console.warn("Failed to save emergency contact:", e),
    );
  };

  return (
    <EmergencyContactContext.Provider
      value={{ emergencyContactData, setEmergencyContactData, isEmergencyContactReady }}
    >
      {children}
    </EmergencyContactContext.Provider>
  );
};

export const useEmergencyContact = () => {
  const ctx = useContext(EmergencyContactContext);
  if (!ctx) throw new Error("useEmergencyContact must be used within EmergencyContactProvider");
  return ctx;
};
