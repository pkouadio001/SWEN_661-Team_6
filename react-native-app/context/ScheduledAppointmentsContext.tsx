<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Appointment {
  id: number;
  title: string;
  subtitle: string;
  date: string; // "Jan 28, 2026"
  time: string; // "10:30 AM"
  provider?: string;
  location?: string;
  notes?: string;
}

interface ScheduledAppointmentsContextType {
  totalAppointments: number;
  confirmedAppointmentIds: number[];
  upcomingAppointmentsCount: number;
  confirmAppointment: (appointmentId: number) => void;
  isAppointmentConfirmed: (appointmentId: number) => boolean;
  resetCount: () => void;
  allAppointments: Appointment[];
}

const ScheduledAppointmentsContext =
  createContext<ScheduledAppointmentsContextType | undefined>(undefined);

const STORAGE_TOTAL_KEY = "scheduled_totalAppointments_v1";
const STORAGE_CONFIRMED_KEY = "scheduled_confirmedAppointmentIds_v1";

const allAppointmentsData: Appointment[] = [
  {
    id: 1,
    title: "Dr. Smith - Cardiology",
    subtitle: "Cardiology",
    date: "Jan 28, 2026",
    time: "10:30 AM",
    provider: "Dr. Sarah Smith",
    location: "Heart Health Center, 123 Medical Plaza, Suite 400",
    notes: "Follow-up appointment for blood pressure management. Bring recent test results.",
  },
  {
    id: 2,
    title: "Dr. Johnson - General Checkup",
    subtitle: "General Checkup",
    date: "Feb 5, 2026",
    time: "2:00 PM",
    provider: "Dr. Michael Johnson",
    location: "Primary Care Clinic, 456 Health Street, Suite 200",
    notes: "Annual physical examination. Please fast for 8 hours before appointment.",
  },
  {
    id: 3,
    title: "Physical Therapist",
    subtitle: "Physical Therapy",
    date: "Jan 27, 2026",
    time: "3:00 PM",
    provider: "Jane Williams, PT",
    location: "Rehabilitation Center, 789 Wellness Ave, Building B",
    notes: "Bring comfortable clothing and athletic shoes. Session focuses on knee rehabilitation.",
  },
  {
    id: 4,
    title: "Lab Work",
    subtitle: "Laboratory",
    date: "Jan 29, 2026",
    time: "8:00 AM",
    provider: "Quest Diagnostics",
    location: "Medical Laboratory, 321 Test Drive, Suite 101",
    notes: "Fasting blood work required. No food or drink except water for 12 hours prior.",
  },
  {
    id: 5,
    title: "Dental Checkup",
    subtitle: "Dentistry",
    date: "Jan 31, 2026",
    time: "11:00 AM",
    provider: "Dr. Emily Chen, DDS",
    location: "Smile Dental Care, 555 Tooth Lane, Suite 300",
    notes: "Regular cleaning and examination. Please arrive 10 minutes early to update records.",
  },
  {
    id: 6,
    title: "Dr. Williams - Dermatology",
    subtitle: "Dermatology",
    date: "Feb 10, 2026",
    time: "9:00 AM",
    provider: "Dr. Robert Williams",
    location: "Skin Health Institute, 888 Derma Road, Floor 3",
    notes: "Annual skin cancer screening. List any new moles or skin changes.",
  },
  {
    id: 7,
    title: "Eye Exam",
    subtitle: "Ophthalmology",
    date: "Feb 12, 2026",
    time: "1:30 PM",
    provider: "Dr. Lisa Martinez, OD",
    location: "Vision Care Center, 999 Eye Street, Suite 150",
    notes: "Comprehensive eye exam. Bring current glasses and contact lens prescription.",
  },
  {
    id: 8,
    title: "Dr. Brown - Pediatrics",
    subtitle: "Pediatrics",
    date: "Feb 15, 2026",
    time: "4:00 PM",
    provider: "Dr. David Brown, MD",
    location: "Children's Health Clinic, 777 Kids Way, Building A",
    notes: "Well-child visit and immunization check. Bring immunization records.",
  },
];

function parseAppointmentDate(dateString: string): Date | null {
  // Accepts "Jan 28, 2026"
  const d = new Date(`${dateString} 00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export const ScheduledAppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // If you want “totalAppointments” to be the dataset size, initialize from that:
  const [totalAppointments, setTotalAppointments] = useState<number>(allAppointmentsData.length);
  const [confirmedAppointmentIds, setConfirmedAppointmentIds] = useState<number[]>([]);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTotal = await AsyncStorage.getItem(STORAGE_TOTAL_KEY);
        const storedIds = await AsyncStorage.getItem(STORAGE_CONFIRMED_KEY);

        if (storedTotal) {
          const num = parseInt(storedTotal, 10);
          if (!Number.isNaN(num)) setTotalAppointments(num);
        }

        if (storedIds) {
          const parsed = JSON.parse(storedIds);
          if (Array.isArray(parsed)) {
            setConfirmedAppointmentIds(parsed.filter((x) => typeof x === "number"));
          }
        }
      } catch (e) {
        console.error("Error loading scheduled appointments state:", e);
      }
    })();
  }, []);

  // Persist changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_TOTAL_KEY, totalAppointments.toString());
      } catch (e) {
        console.error("Error saving totalAppointments:", e);
      }
    })();
  }, [totalAppointments]);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_CONFIRMED_KEY,
          JSON.stringify(confirmedAppointmentIds),
        );
      } catch (e) {
        console.error("Error saving confirmedAppointmentIds:", e);
      }
    })();
  }, [confirmedAppointmentIds]);

  const confirmAppointment = (appointmentId: number) => {
    setConfirmedAppointmentIds((prev) =>
      prev.includes(appointmentId) ? prev : [...prev, appointmentId],
    );
  };

  const isAppointmentConfirmed = (appointmentId: number) => {
    return confirmedAppointmentIds.includes(appointmentId);
  };

  // Upcoming within next 7 days (from NOW) excluding confirmed
  const upcomingAppointmentsCount = useMemo(() => {
    const now = new Date();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const withinWeek = allAppointmentsData.filter((apt) => {
      const aptDate = parseAppointmentDate(apt.date);
      if (!aptDate) return false;
      return aptDate >= now && aptDate < oneWeekLater;
    });

    const unconfirmed = withinWeek.filter((apt) => !confirmedAppointmentIds.includes(apt.id));
    return unconfirmed.length;
  }, [confirmedAppointmentIds]);

  const resetCount = () => {
    setTotalAppointments(allAppointmentsData.length);
    setConfirmedAppointmentIds([]);
    (async () => {
      try {
        await AsyncStorage.removeItem(STORAGE_TOTAL_KEY);
        await AsyncStorage.removeItem(STORAGE_CONFIRMED_KEY);
      } catch (e) {
        console.error("Error clearing scheduled appointments storage:", e);
      }
    })();
  };

  const value: ScheduledAppointmentsContextType = {
    totalAppointments,
    confirmedAppointmentIds,
    upcomingAppointmentsCount,
    confirmAppointment,
    isAppointmentConfirmed,
    resetCount,
    allAppointments: allAppointmentsData,
  };

  return (
    <ScheduledAppointmentsContext.Provider value={value}>
      {children}
    </ScheduledAppointmentsContext.Provider>
  );
};

export const useScheduledAppointments = () => {
  const context = useContext(ScheduledAppointmentsContext);
  if (!context) {
    throw new Error("useScheduledAppointments must be used within ScheduledAppointmentsProvider");
  }
  return context;
};
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Appointment {
  id: number;
  title: string;
  subtitle: string;
  date: string; // "Jan 28, 2026"
  time: string; // "10:30 AM"
  provider?: string;
  location?: string;
  notes?: string;
}

interface ScheduledAppointmentsContextType {
  totalAppointments: number;
  confirmedAppointmentIds: number[];
  upcomingAppointmentsCount: number;
  confirmAppointment: (appointmentId: number) => void;
  isAppointmentConfirmed: (appointmentId: number) => boolean;
  resetCount: () => void;
  allAppointments: Appointment[];
}

const ScheduledAppointmentsContext =
  createContext<ScheduledAppointmentsContextType | undefined>(undefined);

const STORAGE_TOTAL_KEY = "scheduled_totalAppointments_v1";
const STORAGE_CONFIRMED_KEY = "scheduled_confirmedAppointmentIds_v1";

const allAppointmentsData: Appointment[] = [
  {
    id: 1,
    title: "Dr. Smith - Cardiology",
    subtitle: "Cardiology",
    date: "Jan 28, 2026",
    time: "10:30 AM",
    provider: "Dr. Sarah Smith",
    location: "Heart Health Center, 123 Medical Plaza, Suite 400",
    notes: "Follow-up appointment for blood pressure management. Bring recent test results.",
  },
  {
    id: 2,
    title: "Dr. Johnson - General Checkup",
    subtitle: "General Checkup",
    date: "Feb 5, 2026",
    time: "2:00 PM",
    provider: "Dr. Michael Johnson",
    location: "Primary Care Clinic, 456 Health Street, Suite 200",
    notes: "Annual physical examination. Please fast for 8 hours before appointment.",
  },
  {
    id: 3,
    title: "Physical Therapist",
    subtitle: "Physical Therapy",
    date: "Jan 27, 2026",
    time: "3:00 PM",
    provider: "Jane Williams, PT",
    location: "Rehabilitation Center, 789 Wellness Ave, Building B",
    notes: "Bring comfortable clothing and athletic shoes. Session focuses on knee rehabilitation.",
  },
  {
    id: 4,
    title: "Lab Work",
    subtitle: "Laboratory",
    date: "Jan 29, 2026",
    time: "8:00 AM",
    provider: "Quest Diagnostics",
    location: "Medical Laboratory, 321 Test Drive, Suite 101",
    notes: "Fasting blood work required. No food or drink except water for 12 hours prior.",
  },
  {
    id: 5,
    title: "Dental Checkup",
    subtitle: "Dentistry",
    date: "Jan 31, 2026",
    time: "11:00 AM",
    provider: "Dr. Emily Chen, DDS",
    location: "Smile Dental Care, 555 Tooth Lane, Suite 300",
    notes: "Regular cleaning and examination. Please arrive 10 minutes early to update records.",
  },
  {
    id: 6,
    title: "Dr. Williams - Dermatology",
    subtitle: "Dermatology",
    date: "Feb 10, 2026",
    time: "9:00 AM",
    provider: "Dr. Robert Williams",
    location: "Skin Health Institute, 888 Derma Road, Floor 3",
    notes: "Annual skin cancer screening. List any new moles or skin changes.",
  },
  {
    id: 7,
    title: "Eye Exam",
    subtitle: "Ophthalmology",
    date: "Feb 12, 2026",
    time: "1:30 PM",
    provider: "Dr. Lisa Martinez, OD",
    location: "Vision Care Center, 999 Eye Street, Suite 150",
    notes: "Comprehensive eye exam. Bring current glasses and contact lens prescription.",
  },
  {
    id: 8,
    title: "Dr. Brown - Pediatrics",
    subtitle: "Pediatrics",
    date: "Feb 15, 2026",
    time: "4:00 PM",
    provider: "Dr. David Brown, MD",
    location: "Children's Health Clinic, 777 Kids Way, Building A",
    notes: "Well-child visit and immunization check. Bring immunization records.",
  },
];

function parseAppointmentDate(dateString: string): Date | null {
  // Accepts "Jan 28, 2026"
  const d = new Date(`${dateString} 00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export const ScheduledAppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // If you want “totalAppointments” to be the dataset size, initialize from that:
  const [totalAppointments, setTotalAppointments] = useState<number>(allAppointmentsData.length);
  const [confirmedAppointmentIds, setConfirmedAppointmentIds] = useState<number[]>([]);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTotal = await AsyncStorage.getItem(STORAGE_TOTAL_KEY);
        const storedIds = await AsyncStorage.getItem(STORAGE_CONFIRMED_KEY);

        if (storedTotal) {
          const num = parseInt(storedTotal, 10);
          if (!Number.isNaN(num)) setTotalAppointments(num);
        }

        if (storedIds) {
          const parsed = JSON.parse(storedIds);
          if (Array.isArray(parsed)) {
            setConfirmedAppointmentIds(parsed.filter((x) => typeof x === "number"));
          }
        }
      } catch (e) {
        console.error("Error loading scheduled appointments state:", e);
      }
    })();
  }, []);

  // Persist changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_TOTAL_KEY, totalAppointments.toString());
      } catch (e) {
        console.error("Error saving totalAppointments:", e);
      }
    })();
  }, [totalAppointments]);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_CONFIRMED_KEY,
          JSON.stringify(confirmedAppointmentIds),
        );
      } catch (e) {
        console.error("Error saving confirmedAppointmentIds:", e);
      }
    })();
  }, [confirmedAppointmentIds]);

  const confirmAppointment = (appointmentId: number) => {
    setConfirmedAppointmentIds((prev) =>
      prev.includes(appointmentId) ? prev : [...prev, appointmentId],
    );
  };

  const isAppointmentConfirmed = (appointmentId: number) => {
    return confirmedAppointmentIds.includes(appointmentId);
  };

  // Upcoming within next 7 days (from NOW) excluding confirmed
  const upcomingAppointmentsCount = useMemo(() => {
    const now = new Date();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const withinWeek = allAppointmentsData.filter((apt) => {
      const aptDate = parseAppointmentDate(apt.date);
      if (!aptDate) return false;
      return aptDate >= now && aptDate < oneWeekLater;
    });

    const unconfirmed = withinWeek.filter((apt) => !confirmedAppointmentIds.includes(apt.id));
    return unconfirmed.length;
  }, [confirmedAppointmentIds]);

  const resetCount = () => {
    setTotalAppointments(allAppointmentsData.length);
    setConfirmedAppointmentIds([]);
    (async () => {
      try {
        await AsyncStorage.removeItem(STORAGE_TOTAL_KEY);
        await AsyncStorage.removeItem(STORAGE_CONFIRMED_KEY);
      } catch (e) {
        console.error("Error clearing scheduled appointments storage:", e);
      }
    })();
  };

  const value: ScheduledAppointmentsContextType = {
    totalAppointments,
    confirmedAppointmentIds,
    upcomingAppointmentsCount,
    confirmAppointment,
    isAppointmentConfirmed,
    resetCount,
    allAppointments: allAppointmentsData,
  };

  return (
    <ScheduledAppointmentsContext.Provider value={value}>
      {children}
    </ScheduledAppointmentsContext.Provider>
  );
};

export const useScheduledAppointments = () => {
  const context = useContext(ScheduledAppointmentsContext);
  if (!context) {
    throw new Error("useScheduledAppointments must be used within ScheduledAppointmentsProvider");
  }
  return context;
};
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
