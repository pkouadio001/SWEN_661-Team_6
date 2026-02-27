import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import MyHealthScreen from "../screens/MyHealthScreen";
import MedicationsScreen from "../screens/MedicationsScreen";
import SizeDemoScreen from "../screens/SizeDemoScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import MyInfoScreen from "../screens/MyInfoScreen";
import SymptomsScreen from "../screens/SymptomsScreen";

export default function Router() {
  const navigate = useNavigate();

  // Main -> Renderer IPC navigation
  useEffect(() => {
    const off = window.careconnect.onNavigate((route) => navigate(route));
    return () => off();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/my-health" element={<MyHealthScreen />} />
      <Route path="/medications" element={<MedicationsScreen />} />
      <Route path="/size-demo" element={<SizeDemoScreen />} />
      <Route path="/exercises" element={<ExercisesScreen />} />
      <Route path="/my-info" element={<MyInfoScreen />} />
      <Route path="/symptoms" element={<SymptomsScreen />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}