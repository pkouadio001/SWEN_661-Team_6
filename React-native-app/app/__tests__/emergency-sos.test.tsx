// app/_tests_/emergency-sos.test.tsx
import React from "react";

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { Alert, Linking } from "react-native";

import EmergencySOS from "../emergency-sos";

/**
 * expo-router mock (safe: no out-of-scope refs)
 */
jest.mock("expo-router", () => {
  const replace = jest.fn();
  const useRouter = jest.fn(() => ({ replace }));

  return {
    useRouter,
    __mock: { replace },
  };
});

const getRouterMocks = (): { useRouter: jest.Mock; replace: jest.Mock } => {
  const mod = require("expo-router");
  return mod.__mock as { useRouter: jest.Mock; replace: jest.Mock };
};

/**
 * ThemeContext mock (safe)
 */
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
  }));

  return {
    useTheme,
    __mock: { useTheme },
  };
});

const getThemeMocks = (): { useTheme: jest.Mock } => {
  const mod = require("@/context/ThemeContext");
  return mod.__mock as { useTheme: jest.Mock };
};

/**
 * EmergencyContactContext mock (safe)
 */
jest.mock("@/context/EmergencyContactContext", () => {
  const useEmergencyContact = jest.fn(() => ({
    emergencyContactData: { name: "Mom", phone: "(555) 123-4567" },
  }));

  return {
    useEmergencyContact,
    __mock: { useEmergencyContact },
  };
});

const getEmergencyMocks = (): { useEmergencyContact: jest.Mock } => {
  const mod = require("@/context/EmergencyContactContext");
  return mod.__mock as { useEmergencyContact: jest.Mock };
};

describe("EmergencySOS", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // default mocks
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: false });
    getEmergencyMocks().useEmergencyContact.mockReturnValue({
      emergencyContactData: { name: "Mom", phone: "(555) 123-4567" },
    });

    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true as any);
    jest.spyOn(Linking, "openURL").mockResolvedValue(undefined as any);
  });

  it("renders header + options using emergency contact data", () => {
    render(<EmergencySOS />);

    expect(screen.getByText("Emergency SOS Activated")).toBeTruthy();
    expect(
      screen.getByText("Select a contact to call immediately"),
    ).toBeTruthy();

    // primary contact
    expect(screen.getByText("Mom")).toBeTruthy();
    expect(screen.getByText("(555) 123-4567")).toBeTruthy();

    // 911 option
    expect(screen.getByText("Emergency: 911")).toBeTruthy();
    expect(screen.getByText("Police / Fire / EMS")).toBeTruthy();

    // cancel
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("pressing Cancel navigates to /communication", () => {
    render(<EmergencySOS />);

    fireEvent.press(screen.getByText("Cancel"));

    expect(getRouterMocks().replace).toHaveBeenCalledWith("/communication");
  });

  it("pressing the primary contact calls sanitized phone number via tel:", async () => {
    render(<EmergencySOS />);

    fireEvent.press(screen.getByText("Mom"));

    await waitFor(() => {
      // (555) 123-4567 -> 5551234567
      expect(Linking.canOpenURL).toHaveBeenCalledWith("tel:5551234567");
      expect(Linking.openURL).toHaveBeenCalledWith("tel:5551234567");
    });

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("pressing 911 calls tel:911", async () => {
    render(<EmergencySOS />);

    fireEvent.press(screen.getByText("Emergency: 911"));

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith("tel:911");
      expect(Linking.openURL).toHaveBeenCalledWith("tel:911");
    });
  });

  it("shows an alert when device cannot place call (canOpenURL=false)", async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);

    render(<EmergencySOS />);

    fireEvent.press(screen.getByText("Emergency: 911"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Unable to place call",
        "Your device can't open: tel:911",
      );
    });

    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it("shows an alert when calling throws", async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);
    (Linking.openURL as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    render(<EmergencySOS />);

    fireEvent.press(screen.getByText("Emergency: 911"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Call failed",
        "Please try again.",
      );
    });
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: true });

    render(<EmergencySOS />);

    expect(screen.getByText("Emergency SOS Activated")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  it("accessibility: (current code) options are discoverable by visible text; add accessibilityLabel for stronger tests", () => {
    render(<EmergencySOS />);

    // These are not explicit a11y labels; they’re visible text.
    // Recommended in component:
    // Pressable accessibilityRole="button" accessibilityLabel="Call primary contact"
    // Pressable accessibilityLabel="Call 911"
    // Pressable accessibilityLabel="Cancel"
    expect(screen.getByText("Mom")).toBeTruthy();
    expect(screen.getByText("Emergency: 911")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });
});
