import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import MedicationsPage from './pages/MedicationsPage';
import  HealthLogPage from './pages/HealthLogPage';
import  EmergencyPage from './pages/EmergencyPage';
import { MessagesPage } from './pages/MessagesPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import { SignInPage } from './pages/SignInPage';
import { LandingPage } from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no nav */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* Dashboard is STANDALONE - no DashboardLayout, no nav bar */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* These pages all use DashboardLayout which has the nav bar */}
        <Route element={<DashboardLayout />}>
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/healthlog" element={<HealthLogPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}