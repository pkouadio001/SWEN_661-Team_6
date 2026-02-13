// app/_tests_/dashboard.test.tsx

// ✅ Mock AsyncStorage BEFORE importing the screen
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "../(tabs)/dashboard";

jest.mock("@react-native-async-storage/async-storage", () => {
  const clear = jest.fn();
  return {
    __esModule: true,
    default: { clear }, // ✅ most common: AsyncStorage.clear
    clear, // ✅ safety: if someone imports { clear }
    __mock: { clear },
  };
});

// ✅ expo-router mock
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();

  return {
    __esModule: true,
    router: { push, replace, back: jest.fn() },
    usePathname: jest.fn(() => "/dashboard"),
    default: { router: { push, replace, back: jest.fn() } },
    __mock: { push, replace },
  };
});

// ✅ ThemeContext mock (full-ish shape)
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    resetTheme: jest.fn().mockResolvedValue(undefined),
    setHighContrastMode: jest.fn(),
  }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
});

// ✅ MessagesContext mock
jest.mock("@/context/MessagesContext", () => {
  const useMessages = jest.fn(() => ({
    getUnreadCount: jest.fn(() => 3),
  }));
  return { __esModule: true, useMessages, __mock: { useMessages } };
});

const getRouterMocks = (): { push: jest.Mock; replace: jest.Mock } => {
  return require("expo-router").__mock as {
    push: jest.Mock;
    replace: jest.Mock;
  };
};
const getThemeMocks = (): { useTheme: jest.Mock } => {
   
  return require("@/context/ThemeContext").__mock as {
    useTheme: jest.Mock;
  };
};

const getMessagesMocks = (): { useMessages: jest.Mock } => {
   
  return require("@/context/MessagesContext").__mock as {
    useMessages: jest.Mock;
  };
};

describe("DashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      resetTheme: jest.fn().mockResolvedValue(undefined),
      setHighContrastMode: jest.fn(),
    });

    getMessagesMocks().useMessages.mockReturnValue({
      getUnreadCount: jest.fn(() => 3),
    });

    // ✅ works whether AsyncStorage is default object or has .default
    const clearFn =
      (AsyncStorage as any)?.clear ?? (AsyncStorage as any)?.default?.clear;
    clearFn.mockResolvedValue(undefined);
  });

  it("renders main UI (header + cards)", () => {
    render(<DashboardScreen />);

    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,\s*John Doe/i)).toBeTruthy();

    expect(screen.getByText("Tasks & Scheduling")).toBeTruthy();
    expect(screen.getByText("Notes & Health Logs")).toBeTruthy();
    expect(screen.getByText("Communication & Safety")).toBeTruthy();
    expect(screen.getByText("Notifications & Reminders")).toBeTruthy();
    expect(screen.getByText("Patient Information")).toBeTruthy();
    expect(screen.getByText("Profile & Settings")).toBeTruthy();

    expect(screen.getByText("Logoff")).toBeTruthy();
  });

  it("navigates to screens when pressing cards", () => {
    render(<DashboardScreen />);

    fireEvent.press(screen.getByText("Tasks & Scheduling"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/tasks");

    fireEvent.press(screen.getByText("Notes & Health Logs"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/health");

    fireEvent.press(screen.getByText("Communication & Safety"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/communication");

    fireEvent.press(screen.getByText("Notifications & Reminders"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/alerts");

    fireEvent.press(screen.getByText("Profile & Settings"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/profile");
  });

  it("shows unread + alert badges (multiple matches allowed)", () => {
    render(<DashboardScreen />);

    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
  });

  it("logs out: clears storage, resets theme, and routes to /", async () => {
    const resetTheme = jest.fn().mockResolvedValue(undefined);
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      resetTheme,
      setHighContrastMode: jest.fn(),
    });

    render(<DashboardScreen />);

    fireEvent.press(screen.getByText("Logoff"));

    const clearFn =
      (AsyncStorage as any)?.clear ?? (AsyncStorage as any)?.default?.clear;

    await waitFor(() => expect(clearFn).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(resetTheme).toHaveBeenCalledTimes(1));
    expect(getRouterMocks().replace).toHaveBeenCalledWith("/");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      resetTheme: jest.fn().mockResolvedValue(undefined),
      setHighContrastMode: jest.fn(),
    });

    render(<DashboardScreen />);
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Logoff")).toBeTruthy();
  });
});
