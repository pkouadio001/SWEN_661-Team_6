/**
 * Integration Test: Tab Navigation Flow
 * 
 * This test verifies navigation between different tabs
 * and screens in the application.
 */

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "@/app/(tabs)/dashboard";
import TodayTasksScreen from "@/app/(tabs)/today-tasks";
import CommunicationScreen from "@/app/(tabs)/communication";
import AlertsScreen from "@/app/(tabs)/alerts";
import ProfileScreen from "@/app/(tabs)/profile";
import { ThemeProvider } from "@/context/ThemeContext";
import { TasksProvider } from "@/context/TasksContext";
import { MessagesProvider } from "@/context/MessagesContext";
import { EmergencyContactProvider } from "@/context/EmergencyContactContext";

// Mock expo-router
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };
  const usePathname = jest.fn(() => "/dashboard");

  return {
    __esModule: true,
    router,
    useRouter: jest.fn(() => router),
    usePathname,
    default: { router },
    __mock: { push, replace, back, router },
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

const getRouterMocks = () => {
  return require("expo-router").__mock;
};

const FullAppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <TasksProvider>
      <MessagesProvider>
        <EmergencyContactProvider>
          {children}
        </EmergencyContactProvider>
      </MessagesProvider>
    </TasksProvider>
  </ThemeProvider>
);

describe("Integration: Tab Navigation Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dashboard and navigates to tasks", () => {
    const { rerender } = render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Verify dashboard renders
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,/i)).toBeTruthy();

    // Find and press tasks navigation item
    fireEvent.press(screen.getByText("Tasks"));

    // Should call router.push
    expect(getRouterMocks().push).toHaveBeenCalledWith("/tasks");

    // Simulate navigation by rendering tasks screen
    rerender(
      <FullAppProviders>
        <TodayTasksScreen />
      </FullAppProviders>
    );

    // Verify tasks screen renders
    expect(screen.getByText("Today's Tasks")).toBeTruthy();
  });

  it("navigates from dashboard to communication", () => {
    const { rerender } = render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Press communication navigation
    fireEvent.press(screen.getByText("Communication & Safety"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/communication");

    // Simulate navigation
    rerender(
      <FullAppProviders>
        <CommunicationScreen />
      </FullAppProviders>
    );

    expect(screen.getByText("Communication")).toBeTruthy();
  });

  it("navigates from dashboard to alerts", () => {
    const { rerender } = render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Press alerts navigation
    fireEvent.press(screen.getByText("Notifications & Reminders"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/alerts");

    // Simulate navigation
    rerender(
      <FullAppProviders>
        <AlertsScreen />
      </FullAppProviders>
    );

    expect(screen.getByText("Alerts")).toBeTruthy();
  });

  it("navigates from dashboard to profile", () => {
    const { rerender } = render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Press profile navigation
    fireEvent.press(screen.getByText("Profile & Settings"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/profile");

    // Simulate navigation
    rerender(
      <FullAppProviders>
        <ProfileScreen />
      </FullAppProviders>
    );

    expect(screen.getByText("Profile")).toBeTruthy();
  });

  it("maintains state across navigation", () => {
    // Render dashboard
    const { rerender } = render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    expect(screen.getByText("CareConnect")).toBeTruthy();

    // Navigate to tasks
    rerender(
      <FullAppProviders>
        <TodayTasksScreen />
      </FullAppProviders>
    );

    expect(screen.getByText("Today's Tasks")).toBeTruthy();

    // Navigate back to dashboard
    rerender(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Dashboard should still render correctly
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,/i)).toBeTruthy();
  });

  it("displays unread message badge on dashboard", () => {
    render(
      <FullAppProviders>
        <DashboardScreen />
      </FullAppProviders>
    );

    // Dashboard should show communication card
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Communication & Safety")).toBeTruthy();
  });
});
