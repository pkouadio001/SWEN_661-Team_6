// app/_tests_/patient-info.test.tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Modal } from "react-native";
import PatientInfoScreen from "../(tabs)/patient-info";

// ✅ expo-router mock
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  return {
    __esModule: true,
    router,
    __mock: { push, replace, back },
  };
});

// ✅ ThemeContext mock
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
describe("PatientInfoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });
  });

  it("renders header + key sections", () => {
    render(<PatientInfoScreen />);

    expect(
      screen.getAllByText("Patient Information").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Medical details & emergency contact"),
    ).toBeTruthy();

    expect(screen.getByText("← Back to Dashboard")).toBeTruthy();

    // Section titles
    expect(screen.getByText("Personal Details")).toBeTruthy();
    expect(screen.getByText("Medical Information")).toBeTruthy();
    expect(screen.getByText("Emergency Contact")).toBeTruthy();

    // Some fields
    expect(screen.getByText("Full Name")).toBeTruthy();
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Jdoe@hotmail.com")).toBeTruthy();

    // Medical static fields
    expect(screen.getByText("Primary Physician")).toBeTruthy();
    expect(screen.getByText("Dr. Sarah Smith")).toBeTruthy();
  });

  it("navigates to /dashboard when pressing back buttons", () => {
    render(<PatientInfoScreen />);

    // There are 2 back Pressables that route to /dashboard:
    // 1) header back arrow
    // 2) "← Back to Dashboard" card
    const backCard = screen.getByText("← Back to Dashboard");
    fireEvent.press(backCard);

    expect(getRouterMocks().push).toHaveBeenCalledWith("/dashboard");
  });

  it("opens Personal modal, edits fields, and saves (modal closes)", () => {
    render(<PatientInfoScreen />);

    // There are 2 "✎ Edit" buttons; the first one is Personal
    const editButtons = screen.getAllByText("✎ Edit");
    fireEvent.press(editButtons[0]);

    // Modal should now be visible
    const modals = screen.UNSAFE_getAllByType(Modal);
    expect(modals.length).toBeGreaterThan(0);

    expect(screen.getByText("Edit Personal Details")).toBeTruthy();
    expect(screen.getByText("Update your personal information")).toBeTruthy();

    // Update some inputs (placeholder is the label string)
    fireEvent.changeText(
      screen.getByPlaceholderText("Full Name"),
      "Alice Smith",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "alice@test.com",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Date of Birth (YYYY-MM-DD)"),
      "1960-01-01",
    );
    fireEvent.press(screen.getByText("Save Changes"));

    // Modal should close -> header text should no longer be in tree
    expect(screen.queryByText("Edit Personal Details")).toBeNull();

    // Screen reflects updated values
    expect(screen.getByText("Alice Smith")).toBeTruthy();
    expect(screen.getByText("alice@test.com")).toBeTruthy();

    // Also confirm DOB display updated (long format). Example: "January 1, 1960 ..."
    expect(screen.getByText(/January/i)).toBeTruthy();
    expect(screen.getByText(/1960/)).toBeTruthy();
  });

  it("opens Personal modal and Cancel resets to original values", () => {
    render(<PatientInfoScreen />);

    const editButtons = screen.getAllByText("✎ Edit");
    fireEvent.press(editButtons[0]);

    fireEvent.changeText(
      screen.getByPlaceholderText("Full Name"),
      "Changed Name",
    );

    fireEvent.press(screen.getByText("Cancel"));

    // Modal closed
    expect(screen.queryByText("Edit Personal Details")).toBeNull();

    // Back to original on screen
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.queryByText("Changed Name")).toBeNull();
  });

  it("opens Emergency modal, edits, and saves", () => {
    render(<PatientInfoScreen />);

    const editButtons = screen.getAllByText("✎ Edit");
    fireEvent.press(editButtons[1]); // second edit button = Emergency

    expect(screen.getByText("Edit Emergency Contact")).toBeTruthy();
    expect(
      screen.getByText("Update your emergency contact information"),
    ).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText("Contact Name"),
      "Bob Doe",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Phone Number"),
      "555-999-0000",
    );

    fireEvent.press(screen.getByText("Save Changes"));

    // modal closed
    expect(screen.queryByText("Edit Emergency Contact")).toBeNull();

    // updated values shown
    expect(screen.getByText("Bob Doe")).toBeTruthy();
    expect(screen.getByText("555-999-0000")).toBeTruthy();
  });

  it("opens Emergency modal and Cancel resets to original values", () => {
    render(<PatientInfoScreen />);

    const editButtons = screen.getAllByText("✎ Edit");
    fireEvent.press(editButtons[1]);

    fireEvent.changeText(
      screen.getByPlaceholderText("Contact Name"),
      "Someone Else",
    );

    fireEvent.press(screen.getByText("Cancel"));

    expect(screen.queryByText("Edit Emergency Contact")).toBeNull();

    // original values
    expect(screen.getByText("Jane Doe (Daughter)")).toBeTruthy();
    expect(screen.getByText("(555) 123-4567")).toBeTruthy();
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<PatientInfoScreen />);

    expect(
      screen.getAllByText("Patient Information").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("← Back to Dashboard")).toBeTruthy();
    expect(screen.getByText("Emergency Contact")).toBeTruthy();
  });
});
