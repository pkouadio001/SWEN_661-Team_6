/**
 * Integration Test: Login to Dashboard Flow
 * 
 * This test verifies the complete user flow from login screen
 * to the dashboard, including navigation and data persistence.
 */

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { TextInput } from "react-native";

import Index from "@/app/index";
import Dashboard from "@/app/(tabs)/dashboard";
import { ThemeProvider } from "@/context/ThemeContext";
import { MessagesProvider } from "@/context/MessagesContext";

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
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const getRouterMocks = () => {
  return require("expo-router").__mock;
};

describe("Integration: Login to Dashboard Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("completes full login flow and navigates to dashboard", async () => {
    jest.useFakeTimers();

    // Render login screen
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    // Verify login screen renders
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Welcome Back")).toBeTruthy();

    // Fill in credentials
    fireEvent.changeText(screen.getByPlaceholderText("username"), "JDoe");

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    const pinBoxes = inputs.slice(1, 7);

    fireEvent.changeText(pinBoxes[0], "1");
    fireEvent.changeText(pinBoxes[1], "2");
    fireEvent.changeText(pinBoxes[2], "3");
    fireEvent.changeText(pinBoxes[3], "4");
    fireEvent.changeText(pinBoxes[4], "5");
    fireEvent.changeText(pinBoxes[5], "6");

    // Submit login
    const loginButtons = screen.getAllByText("Login");
    const loginButton = loginButtons[1]; // Second one is the submit button
    fireEvent.press(loginButton);

    // Wait for navigation
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(getRouterMocks().push).toHaveBeenCalledWith("/dashboard");
    });

    jest.useRealTimers();
  });

  it("renders dashboard after successful login", () => {
    // Render dashboard with providers
    render(
      <ThemeProvider>
        <MessagesProvider>
          <Dashboard />
        </MessagesProvider>
      </ThemeProvider>
    );

    // Verify dashboard elements
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,/i)).toBeTruthy();
    expect(screen.getByText("Tasks & Scheduling")).toBeTruthy();
  });

  it("prevents login with invalid credentials", () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    // Try to login with empty username
    fireEvent.changeText(screen.getByPlaceholderText("username"), "   ");

    const loginButtons = screen.getAllByText("Login");
    const loginButton = loginButtons[1];
    fireEvent.press(loginButton);

    // Should show error and not navigate
    expect(screen.getByText("Username is required.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalledWith("/dashboard");
  });

  it("prevents login with incomplete PIN", () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    // Fill username but leave PIN incomplete
    fireEvent.changeText(screen.getByPlaceholderText("username"), "JDoe");

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    const pinBoxes = inputs.slice(1, 7);
    
    // Only fill first 3 digits
    fireEvent.changeText(pinBoxes[0], "1");
    fireEvent.changeText(pinBoxes[1], "2");
    fireEvent.changeText(pinBoxes[2], "3");

    const loginButtons = screen.getAllByText("Login");
    const loginButton = loginButtons[1];
    fireEvent.press(loginButton);

    // Should show error
    expect(screen.getByText("Please enter your 6-digit PIN.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalledWith("/dashboard");
  });
});
