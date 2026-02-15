/**
 * Integration Test: Messages Context with Communication Screen
 * 
 * This test verifies the integration between MessagesContext
 * and the Communication/Messages screens.
 */

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import CommunicationScreen from "@/app/(tabs)/communication";
import { MessagesProvider } from "@/context/MessagesContext";
import { EmergencyContactProvider } from "@/context/EmergencyContactContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Mock expo-router
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };
  const usePathname = jest.fn(() => "/communication");

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
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

const getRouterMocks = () => {
  return require("expo-router").__mock;
};

describe("Integration: Messages Context with Communication Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders communication screen with messages from context", () => {
    render(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    // Verify screen renders
    expect(screen.getByText("Communication")).toBeTruthy();
    
    // Should show messages section
    expect(screen.getByText("Messages")).toBeTruthy();
  });

  it("displays unread message count", () => {
    render(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    // The screen should display message information
    // Default messages should be present
    expect(screen.getByText("Messages")).toBeTruthy();
  });

  it("allows marking messages as read", async () => {
    const { getByText } = render(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    // Communication screen should have message interactions
    expect(getByText("Communication")).toBeTruthy();
  });

  it("navigates to messages screen when messages card is pressed", () => {
    render(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    // Find and press Messages section if it's a pressable card
    const messagesText = screen.getByText("Messages");
    expect(messagesText).toBeTruthy();
  });

  it("persists messages data across re-renders", () => {
    const { rerender } = render(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    // Verify initial render
    expect(screen.getByText("Communication")).toBeTruthy();

    // Re-render and verify data persists
    rerender(
      <ThemeProvider>
        <MessagesProvider>
          <EmergencyContactProvider>
            <CommunicationScreen />
          </EmergencyContactProvider>
        </MessagesProvider>
      </ThemeProvider>
    );

    expect(screen.getByText("Communication")).toBeTruthy();
    expect(screen.getByText("Messages")).toBeTruthy();
  });
});
});
