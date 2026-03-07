import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

export default function Router() {
  const navigate = useNavigate();

  useEffect(() => {
    const off = window.careconnect.onNavigate((route) => navigate(route));
    return () => off();
  }, [navigate]);

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