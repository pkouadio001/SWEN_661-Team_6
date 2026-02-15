/**
 * Integration Test: Registration Flow
 * 
 * This test verifies the complete user registration flow,
 * including navigation and form validation.
 */

// Mock AsyncStorage first before any imports
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import RegisterScreen from "@/app/register";
import { ThemeProvider } from "@/context/ThemeContext";

// Mock expo-router
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  return {
    __esModule: true,
    router,
    useRouter: jest.fn(() => router),
    default: { router },
    __mock: { push, replace, back, router },
  };
});

const getRouterMocks = () => {
  return require("expo-router").__mock;
};

describe("Integration: Registration Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("completes full registration with valid inputs", async () => {
    jest.useFakeTimers();

    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Verify registration screen renders
    expect(screen.getByText("Create Account")).toBeTruthy();

    // Fill the PIN (other fields are pre-filled)
    const pinInputs = screen.getAllByLabelText(/PIN digit/);
    fireEvent.changeText(pinInputs[0], "1");
    fireEvent.changeText(pinInputs[1], "2");
    fireEvent.changeText(pinInputs[2], "3");
    fireEvent.changeText(pinInputs[3], "4");
    fireEvent.changeText(pinInputs[4], "5");
    fireEvent.changeText(pinInputs[5], "6");

    // Submit registration
    const registerButton = screen.getByLabelText("Register");
    fireEvent.press(registerButton);

    jest.advanceTimersByTime(500);

    // Should navigate to dashboard on success
    await waitFor(() => {
      expect(getRouterMocks().replace).toHaveBeenCalledWith("/dashboard");
    });

    jest.useRealTimers();
  });

  it("validates required fields before submission", () => {
    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Clear one of the fields to trigger validation
    fireEvent.changeText(screen.getByDisplayValue("John Doe"), "");

    // Try to submit - use accessibility label to get the button specifically
    fireEvent.press(screen.getByLabelText("Register"));

    // Should show validation error
    expect(screen.getByText("Full name is required.")).toBeTruthy();
    expect(getRouterMocks().replace).not.toHaveBeenCalled();
  });

  it("navigates back when back button is pressed", () => {
    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Find and press back button (has "Go back" accessibility label)
    const backButton = screen.getByLabelText("Go back");
    fireEvent.press(backButton);

    expect(getRouterMocks().back).toHaveBeenCalled();
  });
});
