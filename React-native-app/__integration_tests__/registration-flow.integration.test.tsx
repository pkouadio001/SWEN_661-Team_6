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
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Create Account")).toBeTruthy();

    // Fill in all required fields
    fireEvent.changeText(screen.getByPlaceholderText("username"), "newuser");
    fireEvent.changeText(screen.getByPlaceholderText("email@example.com"), "test@example.com");

    // Find and fill PIN boxes
    const pinInputs = screen.getAllByDisplayValue("");
    // Assuming first 6 empty inputs are for PIN
    fireEvent.changeText(pinInputs[0], "1");
    fireEvent.changeText(pinInputs[1], "2");
    fireEvent.changeText(pinInputs[2], "3");
    fireEvent.changeText(pinInputs[3], "4");
    fireEvent.changeText(pinInputs[4], "5");
    fireEvent.changeText(pinInputs[5], "6");

    // Find and fill confirm PIN boxes
    fireEvent.changeText(pinInputs[6], "1");
    fireEvent.changeText(pinInputs[7], "2");
    fireEvent.changeText(pinInputs[8], "3");
    fireEvent.changeText(pinInputs[9], "4");
    fireEvent.changeText(pinInputs[10], "5");
    fireEvent.changeText(pinInputs[11], "6");

    // Submit registration
    const registerButtons = screen.getAllByText("Register");
    const registerButton = registerButtons[registerButtons.length - 1]; // Last one is the submit button
    fireEvent.press(registerButton);

    jest.advanceTimersByTime(500);

    // Should navigate to dashboard on success
    await waitFor(() => {
      expect(getRouterMocks().push).toHaveBeenCalledWith("/dashboard");
    });

    jest.useRealTimers();
  });

  it("validates required fields before submission", () => {
    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Try to submit without filling fields
    const registerButtons = screen.getAllByText("Register");
    const registerButton = registerButtons[registerButtons.length - 1];
    fireEvent.press(registerButton);

    // Should show validation error
    expect(screen.getByText("Username is required.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalled();
  });

  it("validates PIN confirmation matches", () => {
    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Fill in username and email
    fireEvent.changeText(screen.getByPlaceholderText("username"), "newuser");
    fireEvent.changeText(screen.getByPlaceholderText("email@example.com"), "test@example.com");

    // Fill PIN and non-matching confirm PIN
    const pinInputs = screen.getAllByDisplayValue("");
    
    // Fill PIN
    fireEvent.changeText(pinInputs[0], "1");
    fireEvent.changeText(pinInputs[1], "2");
    fireEvent.changeText(pinInputs[2], "3");
    fireEvent.changeText(pinInputs[3], "4");
    fireEvent.changeText(pinInputs[4], "5");
    fireEvent.changeText(pinInputs[5], "6");

    // Fill different confirm PIN
    fireEvent.changeText(pinInputs[6], "9");
    fireEvent.changeText(pinInputs[7], "9");
    fireEvent.changeText(pinInputs[8], "9");
    fireEvent.changeText(pinInputs[9], "9");
    fireEvent.changeText(pinInputs[10], "9");
    fireEvent.changeText(pinInputs[11], "9");

    // Submit
    const registerButtons = screen.getAllByText("Register");
    const registerButton = registerButtons[registerButtons.length - 1];
    fireEvent.press(registerButton);

    // Should show error
    expect(screen.getByText("PINs do not match.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalledWith("/dashboard");
  });

  it("navigates back to login when login link is pressed", () => {
    render(
      <ThemeProvider>
        <RegisterScreen />
      </ThemeProvider>
    );

    // Find and press login link
    fireEvent.press(screen.getByText("Already have an account? Login"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/");
  });
});
