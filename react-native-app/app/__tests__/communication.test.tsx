// app/_tests_/communication.test.tsx

/**
 * ✅ expo-router mock (router + Link)
 * - Link(asChild) clones child so Pressable stays clickable
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import CommunicationScreen from "../(tabs)/communication";

import { useEmergencyContact } from "@/context/EmergencyContactContext";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  const Link = ({ children, asChild }: any) => {
    if (asChild && React.isValidElement(children))
      return React.cloneElement(children);
    return <View>{children}</View>;
  };

  return {
    __esModule: true,
    router,
    Link,
    default: { router },
    __mock: { push, replace, back },
  };
});

/**
 * ✅ ThemeContext mock (full shape)
 */
jest.mock("@/context/ThemeContext", () => ({
  __esModule: true,
  useTheme: jest.fn(),
}));

/**
 * ✅ EmergencyContactContext mock
 */
jest.mock("@/context/EmergencyContactContext", () => ({
  __esModule: true,
  useEmergencyContact: jest.fn(),
}));

/**
 * ✅ MessagesContext mock
 */
jest.mock("@/context/MessagesContext", () => ({
  __esModule: true,
  useMessages: jest.fn(),
}));

describe("CommunicationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useTheme as unknown as jest.Mock).mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    (useEmergencyContact as unknown as jest.Mock).mockReturnValue({
      emergencyContactData: { name: "Jane Doe", phone: "5551234567" },
      setEmergencyContactData: jest.fn(),
    });

    (useMessages as unknown as jest.Mock).mockReturnValue({
      getUnreadCount: jest.fn(() => 0),
    });
  });

  it("renders main UI (header, cards, nav)", () => {
    render(<CommunicationScreen />);

    expect(screen.getByText("Communication & Safety")).toBeTruthy();
    expect(screen.getByText("Messages and emergency contacts")).toBeTruthy();

    expect(screen.getByText("← Back to Dashboard")).toBeTruthy();

    // Messages card
    expect(screen.getAllByText("Messages").length).toBeGreaterThan(0);
    expect(screen.getByText("Stay connected with your care team")).toBeTruthy();

    // Safety section
    expect(screen.getByText("Safety")).toBeTruthy();
    expect(screen.getByText("Emergency contacts")).toBeTruthy();
    expect(screen.getByText("✎ Edit")).toBeTruthy();

    // Emergency contact row
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("5551234567")).toBeTruthy();

    // 911 row
    expect(screen.getByText("Emergency: 911")).toBeTruthy();
    expect(screen.getByText("Police/Fire/EMS")).toBeTruthy();

    // Bottom nav labels
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Tasks")).toBeTruthy();
    expect(screen.getByText("Health")).toBeTruthy();
    expect(screen.getByText("Alerts")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
  });

  it("navigates to /dashboard when pressing back button", () => {
    render(<CommunicationScreen />);

    fireEvent.press(screen.getByText("← Back to Dashboard"));
    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    (useTheme as unknown as jest.Mock).mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<CommunicationScreen />);

    expect(screen.getByText("Communication & Safety")).toBeTruthy();
    expect(screen.getByText("Safety")).toBeTruthy();
  });
});
