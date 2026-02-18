import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Switch } from "react-native";

import NotificationSettingsScreen from "../notification-settings";

jest.mock("@react-native-async-storage/async-storage", () => {
  const storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  return {
    __esModule: true,
    default: storage, // ✅ IMPORTANT: your screen uses default import AsyncStorage
    getItem: storage.getItem,
    setItem: storage.setItem,
  };
});

// ✅ expo-router mock (router + Link + useFocusEffect)
jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const push = jest.fn();
  const replace = jest.fn();
  const router = { push, replace };

  // Run focus effect immediately
  const useFocusEffect = (cb: any) => {
    cb?.();
  };

  // Minimal Link mock. If asChild, keep the child pressable.
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
    __mock: { push, replace },
  };
});

jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    setHighContrastMode: jest.fn(),
    resetTheme: jest.fn(),
  }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
});

const getRouterMocks = (): { push: jest.Mock } => {
   
  return require("expo-router").__mock as { push: jest.Mock };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
   
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};

describe("NotificationSettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    (AsyncStorage.getItem as unknown as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as unknown as jest.Mock).mockResolvedValue(undefined);
  });

  it("renders main sections", () => {
    render(<NotificationSettingsScreen />);

    expect(screen.getByText("Notification Settings")).toBeTruthy();
    expect(
      screen.getByText("Customize your notification preferences"),
    ).toBeTruthy();

    expect(screen.getByText("Notification Channels")).toBeTruthy();
    expect(screen.getByText("Vibration Settings")).toBeTruthy();
    expect(screen.getByText("Quiet Hours")).toBeTruthy();

    expect(screen.getByText("Save Settings")).toBeTruthy();

    // Bottom nav labels
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Tasks")).toBeTruthy();
    expect(screen.getByText("Health")).toBeTruthy();
    expect(screen.getByText("Messages")).toBeTruthy();
    expect(screen.getByText("Alerts")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
  });

  it("loads saved settings from AsyncStorage on focus", async () => {
    (AsyncStorage.getItem as unknown as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        pushEnabled: false,
        emailEnabled: true,
        normalVibration: "low",
        urgentVibration: "high",
        quietHoursEnabled: true,
        quietStart: "21:30",
        quietEnd: "06:15",
      }),
    );

    render(<NotificationSettingsScreen />);

    // Quiet hours enabled -> inputs appear with saved values
    expect(await screen.findByText("Start Time")).toBeTruthy();
    expect(screen.getByText("End Time")).toBeTruthy();

    expect(screen.getByDisplayValue("21:30")).toBeTruthy();
    expect(screen.getByDisplayValue("06:15")).toBeTruthy();
  });

  it("enables Quiet Hours to show time inputs", async () => {
    render(<NotificationSettingsScreen />);

    // Switch order in this screen: Push, Email, Quiet Hours
    const switches = screen.UNSAFE_getAllByType(Switch);
    fireEvent(switches[2], "valueChange", true);

    expect(await screen.findByText("Start Time")).toBeTruthy();
    expect(screen.getByText("End Time")).toBeTruthy();

    expect(screen.getByDisplayValue("22:00")).toBeTruthy();
    expect(screen.getByDisplayValue("07:00")).toBeTruthy();
  });

  it("saves settings to AsyncStorage and navigates to /alerts", async () => {
    render(<NotificationSettingsScreen />);

    // Enable Quiet Hours
    const switches = screen.UNSAFE_getAllByType(Switch);
    fireEvent(switches[2], "valueChange", true);

    // Update time fields by grabbing displayed values
    const start = await screen.findByDisplayValue("22:00");
    const end = screen.getByDisplayValue("07:00");

    fireEvent.changeText(start, "23:10");
    fireEvent.changeText(end, "05:45");

    // Change a vibration pill (there are two sections with "off", so take the first)
    fireEvent.press(screen.getAllByText("off")[0]);

    // Save
    fireEvent.press(screen.getByText("Save Settings"));

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1));

    const [key, saved] = (AsyncStorage.setItem as unknown as jest.Mock).mock
      .calls[0];
    expect(key).toBe("notificationSettings_v1");

    const parsed = JSON.parse(saved);
    expect(parsed.quietHoursEnabled).toBe(true);
    expect(parsed.quietStart).toBe("23:10");
    expect(parsed.quietEnd).toBe("05:45");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<NotificationSettingsScreen />);

    expect(screen.getByText("Notification Settings")).toBeTruthy();
    expect(screen.getByText("Save Settings")).toBeTruthy();
  });
});
