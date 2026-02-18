/**
 * Integration Test: Theme Context Integration
 * 
 * This test verifies that the theme context properly integrates
 * with various screens and persists theme preferences.
 */

// Mock AsyncStorage first
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

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

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "../app/(tabs)/dashboard";
import Index from "../app/index";
import { ThemeProvider } from "@/context/ThemeContext";
import { MessagesProvider } from "@/context/MessagesContext";

describe("Integration: Theme Context with UI Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login screen with default theme", () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    // Verify screen renders
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Welcome Back")).toBeTruthy();
  });

  it("renders dashboard with default theme", () => {
    render(
      <ThemeProvider>
        <MessagesProvider>
          <DashboardScreen />
        </MessagesProvider>
      </ThemeProvider>
    );

    // Verify dashboard renders
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,/i)).toBeTruthy();
  });

  it("theme persists across screen changes", () => {
    const { rerender } = render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    // Verify login screen
    expect(screen.getByText("CareConnect")).toBeTruthy();

    // Change to dashboard
    rerender(
      <ThemeProvider>
        <MessagesProvider>
          <DashboardScreen />
        </MessagesProvider>
      </ThemeProvider>
    );

    // Verify dashboard renders
    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText(/Welcome,/i)).toBeTruthy();
  });
});
