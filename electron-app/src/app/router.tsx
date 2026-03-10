import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

//import AppLayout from "../app/layouts/AppLayout";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import MyHealthScreen from "../screens/MyHealthScreen";
import MedicationsScreen from "../screens/MedicationsScreen";
import SizeDemoScreen from "../screens/SizeDemoScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import MyInfoScreen from "../screens/MyInfoScreen";
import SymptomsScreen from "../screens/SymptomsScreen";
import EmergencyScreen from "../screens/EmergencyScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen"; 

const AUTH_KEY = "careconnect.authenticated";

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export default function Router() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const off = window.careconnect.onNavigate((route) => {
      if (route === "/login") {
        localStorage.removeItem(AUTH_KEY);
        navigate("/login");
        return;
      }

      if (route === "/dashboard" && !isAuthenticated()) {
        navigate("/login");
        return;
      }
      navigate(route);
    });
    return () => off();
  }, [navigate]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;

      if (event.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;
        if (!active) return;

        const roleCheckbox =
          active.getAttribute("role") === "checkbox"
            ? active
            : active.closest("[role='checkbox']");

        if (roleCheckbox instanceof HTMLElement) {
          event.preventDefault();
          roleCheckbox.click();
          return;
        }

        const checkbox =
          active instanceof HTMLInputElement && active.type === "checkbox"
            ? active
            : active.closest("label")?.querySelector("input[type='checkbox']") ??
              active.querySelector("input[type='checkbox']");

        if (checkbox instanceof HTMLInputElement) {
          event.preventDefault();
          checkbox.click();
        }
        return;
      }

      if (event.key !== "Escape") return;
      if (location.pathname === "/dashboard" || location.pathname === "/login") return;
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      navigate("/dashboard");
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginScreen />} />

      {/* App shell (sidebar stays visible on all these) */}
      <Route>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/my-health" element={<MyHealthScreen />} />
        <Route path="/medications" element={<MedicationsScreen />} />
        <Route path="/size-demo" element={<SizeDemoScreen />} />
        <Route path="/exercises" element={<ExercisesScreen />} />
        <Route path="/my-info" element={<MyInfoScreen />} />
        <Route path="/symptoms" element={<SymptomsScreen />} />
        <Route path="/activities" element={<ActivitiesScreen />} />
        <Route path="/emergency" element={<EmergencyScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}