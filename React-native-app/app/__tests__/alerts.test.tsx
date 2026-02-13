// app/_tests_/alerts.test.tsx

/**
 * ✅ Mock AsyncStorage BEFORE importing the screen
 * Make methods available on BOTH:
 *  - module.getItem
 *  - module.default.getItem
 * so whichever import style your transpilation uses will work.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";

import AlertsScreen from "../(tabs)/alerts";

jest.mock("@react-native-async-storage/async-storage", () => {
  const getItem = jest.fn();
  const setItem = jest.fn();
  const removeItem = jest.fn();

  return {
    __esModule: true,
    getItem,
    setItem,
    removeItem,
    default: { getItem, setItem, removeItem },
  };
});

/**
 * ✅ Mock expo-router (router + Link + useFocusEffect)
 */
jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  const useFocusEffect = (cb: any) => {
    cb?.();
  };

  const Link = ({ children, asChild }: any) => {
    if (asChild && React.isValidElement(children))
      return React.cloneElement(children);
    return <View>{children}</View>;
  };

  return {
    __esModule: true,
    router,
    Link,
    useFocusEffect,
    default: { router },
    __mock: { push, replace, back },
  };
});

/**
 * ✅ Mock ThemeContext (full shape to satisfy TS)
 */
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    setHighContrastMode: jest.fn(),
    resetTheme: jest.fn(),
  }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
}); // <-- adjust path if your file name differs (e.g. "../alerts-screen")

const getRouterMocks = (): { push: jest.Mock; back: jest.Mock } => {
  return require("expo-router").__mock as { push: jest.Mock; back: jest.Mock };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};

const getGetItemMock = (): jest.Mock => {
  // Works for both shapes:
  // AsyncStorage.getItem OR AsyncStorage.default.getItem
  return ((AsyncStorage as any).getItem ??
    (AsyncStorage as any).default?.getItem) as jest.Mock;
};

describe("AlertsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    getGetItemMock().mockResolvedValue(null);
  });

  it("renders main UI", () => {
    render(<AlertsScreen />);

    expect(screen.getByText("Notifications & Reminders")).toBeTruthy();
    expect(screen.getByText("Stay on track with your care")).toBeTruthy();

    expect(screen.getByText("Notification Settings")).toBeTruthy();
    expect(
      screen.getByText("Customize how you receive reminders"),
    ).toBeTruthy();

    expect(screen.getByText("Push Notifications")).toBeTruthy();
    expect(screen.getByText("Configure")).toBeTruthy();

    expect(screen.getByText("Normal Priority Vibration")).toBeTruthy();
    expect(screen.getByText("Urgent Priority Vibration")).toBeTruthy();

    // Bottom nav labels
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Tasks")).toBeTruthy();
    expect(screen.getByText("Health")).toBeTruthy();
    expect(screen.getByText("Messages")).toBeTruthy();
    expect(screen.getByText("Alerts")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
  });

  it("loads vibration settings from AsyncStorage on focus and displays them", async () => {
    getGetItemMock().mockResolvedValueOnce(
      JSON.stringify({ normalVibration: "low", urgentVibration: "off" }),
    );

    render(<AlertsScreen />);

    await waitFor(() =>
      expect(getGetItemMock()).toHaveBeenCalledWith("notificationSettings"),
    );

    // "Current:" text exists, and the values appear as nested Text nodes
    expect(screen.getAllByText("low").length).toBeGreaterThan(0);
    expect(screen.getAllByText("off").length).toBeGreaterThan(0);
  });

  it("navigates to /dashboard when pressing Back to Dashboard", () => {
    render(<AlertsScreen />);

    fireEvent.press(screen.getByText("← Back to Dashboard"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/dashboard");
  });

  it("navigates to /notification-settings when pressing Configure", () => {
    render(<AlertsScreen />);

    fireEvent.press(screen.getByText("Configure"));

    expect(getRouterMocks().push).toHaveBeenCalledWith(
      "/notification-settings",
    );
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<AlertsScreen />);

    expect(screen.getByText("Notifications & Reminders")).toBeTruthy();
    expect(screen.getByText("Notification Settings")).toBeTruthy();
    expect(screen.getByText("Alerts")).toBeTruthy();
  });
});
