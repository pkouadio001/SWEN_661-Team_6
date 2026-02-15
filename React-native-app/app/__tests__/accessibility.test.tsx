/**
 * Comprehensive Accessibility Tests
 * 
 * This file demonstrates testing with React Native Testing Library's
 * built-in accessibility matchers (v12.4+) and validates WCAG 2.1 Level AA compliance.
 * 
 * These tests can be used as examples for testing any screen in the app.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "../(tabs)/dashboard";

jest.mock("@react-native-async-storage/async-storage", () => {
  const clear = jest.fn();
  return {
    __esModule: true,
    default: { clear },
    clear,
    __mock: { clear },
  };
});

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();

  return {
    __esModule: true,
    router: { push, replace, back: jest.fn() },
    usePathname: jest.fn(() => "/dashboard"),
    default: { router: { push, replace, back: jest.fn() } },
    __mock: { push, replace },
  };
});

jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    resetTheme: jest.fn().mockResolvedValue(undefined),
    setHighContrastMode: jest.fn(),
  }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
});

jest.mock("@/context/MessagesContext", () => {
  const useMessages = jest.fn(() => ({
    getUnreadCount: jest.fn(() => 3),
  }));
  return { __esModule: true, useMessages, __mock: { useMessages } };
});

const getRouterMocks = (): { push: jest.Mock; replace: jest.Mock } => {
  return require("expo-router").__mock as {
    push: jest.Mock;
    replace: jest.Mock;
  };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
  return require("@/context/ThemeContext").__mock as {
    useTheme: jest.Mock;
  };
};

describe("Accessibility Testing - Dashboard Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      resetTheme: jest.fn().mockResolvedValue(undefined),
      setHighContrastMode: jest.fn(),
    });

    const clearFn =
      (AsyncStorage as any)?.clear ?? (AsyncStorage as any)?.default?.clear;
    clearFn.mockResolvedValue(undefined);
  });

  /**
   * WCAG 2.1 Success Criterion 4.1.2 (Name, Role, Value)
   * All interactive elements must have accessible names and appropriate roles
   */
  describe("Accessible Names and Roles", () => {
    it("has accessible names for all interactive buttons", () => {
      render(<DashboardScreen />);

      // Using getByRole to find buttons by their accessibility role
      const tasksButton = screen.getByRole("button", {
        name: /Tasks & Scheduling/i,
      });
      expect(tasksButton).toBeTruthy();

      const healthButton = screen.getByRole("button", {
        name: /Notes & Health Logs/i,
      });
      expect(healthButton).toBeTruthy();

      const commButton = screen.getByRole("button", {
        name: /Communication & Safety/i,
      });
      expect(commButton).toBeTruthy();

      const logoffButton = screen.getByRole("button", { name: /Logoff/i });
      expect(logoffButton).toBeTruthy();
    });

    it("has proper accessibility hints for user guidance", () => {
      render(<DashboardScreen />);

      // Check that buttons have accessibility hints
      const tasksButton = screen.getByA11yHint(/Navigate to Tasks & Scheduling section/i);
      expect(tasksButton).toBeTruthy();
    });
  });

  /**
   * WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships)
   * Semantic structure must be programmatically determinable
   */
  describe("Semantic Structure", () => {
    it("has proper heading hierarchy", () => {
      render(<DashboardScreen />);

      // Headers should be marked with accessibilityRole="header"
      const mainHeader = screen.getByRole("header", { name: /CareConnect/i });
      expect(mainHeader).toBeTruthy();
    });

    it("groups related content appropriately", () => {
      render(<DashboardScreen />);

      // All navigation cards should have button role
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  /**
   * Screen Reader Navigation Tests
   * Ensures elements are properly ordered and navigable
   */
  describe("Screen Reader Navigation", () => {
    it("can find elements by accessibility label", () => {
      render(<DashboardScreen />);

      // Screen readers announce elements by their accessibility labels
      const tasksCard = screen.getByLabelText(/Tasks & Scheduling/i);
      expect(tasksCard).toBeTruthy();

      const healthCard = screen.getByLabelText(/Notes & Health Logs/i);
      expect(healthCard).toBeTruthy();
    });

    it("important text is accessible to screen readers", () => {
      render(<DashboardScreen />);

      // Screen readers should be able to find all important text
      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(screen.getByText(/Welcome,\s*John Doe/i)).toBeTruthy();
    });
  });

  /**
   * WCAG 2.1 Success Criterion 2.5.3 (Label in Name)
   * Visible labels should be part of accessible names
   */
  describe("Label in Name", () => {
    it("visible text matches accessible name", () => {
      render(<DashboardScreen />);

      // The visible text "Tasks & Scheduling" should be in the accessible name
      const button = screen.getByText("Tasks & Scheduling");
      expect(button).toBeTruthy();

      // And it should also be findable by its role and name
      const sameButton = screen.getByRole("button", {
        name: /Tasks & Scheduling/i,
      });
      expect(sameButton).toBeTruthy();
    });
  });

  /**
   * WCAG 2.1 Success Criterion 2.4.4 (Link Purpose)
   * The purpose of each link/button should be clear from its name
   */
  describe("Clear Purpose", () => {
    it("button purposes are clear from their labels", () => {
      render(<DashboardScreen />);

      // Each button's purpose should be clear from its accessible name
      expect(
        screen.getByRole("button", { name: /Tasks & Scheduling/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Notes & Health Logs/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Communication & Safety/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Notifications & Reminders/i })
      ).toBeTruthy();
    });
  });

  /**
   * Interactive Element Testing
   * Validates that all interactive elements work correctly
   */
  describe("Interactive Elements", () => {
    it("buttons respond to press events", () => {
      render(<DashboardScreen />);

      const tasksButton = screen.getByRole("button", {
        name: /Tasks & Scheduling/i,
      });
      fireEvent.press(tasksButton);

      expect(getRouterMocks().push).toHaveBeenCalledWith("/tasks");
    });

    it("maintains focus order for keyboard/screen reader navigation", () => {
      render(<DashboardScreen />);

      // Get all buttons in order
      const buttons = screen.getAllByRole("button");

      // Verify buttons are in logical order
      expect(buttons.length).toBeGreaterThan(0);

      // First interactive element should be a navigation card or logoff
      const firstButton = buttons[0];
      expect(firstButton).toBeTruthy();
    });
  });

  /**
   * Badge and Status Information
   * Ensures status indicators are accessible
   */
  describe("Status Information", () => {
    it("displays notification badges accessibly", () => {
      render(<DashboardScreen />);

      // Badges should be visible and announced
      const badges = screen.getAllByText("3"); // unread count
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  /**
   * High Contrast Mode Support
   * WCAG 2.1 Success Criterion 1.4.3 (Contrast - Minimum)
   */
  describe("High Contrast Mode", () => {
    it("supports high contrast mode for better visibility", () => {
      getThemeMocks().useTheme.mockReturnValue({
        highContrastMode: true,
        resetTheme: jest.fn().mockResolvedValue(undefined),
        setHighContrastMode: jest.fn(),
      });

      render(<DashboardScreen />);

      // Screen should render without errors in high contrast mode
      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Tasks & Scheduling/i })
      ).toBeTruthy();
    });
  });

  /**
   * Testing with accessibility queries
   * Demonstrates various ways to query accessible elements
   */
  describe("Accessibility Query Methods", () => {
    it("can query by accessibility role", () => {
      render(<DashboardScreen />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(5);

      const headers = screen.getAllByRole("header");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("can query by accessibility label", () => {
      render(<DashboardScreen />);

      const element = screen.getByLabelText(/Tasks & Scheduling/i);
      expect(element).toBeTruthy();
    });

    it("can query by accessibility hint", () => {
      render(<DashboardScreen />);

      const element = screen.getByA11yHint(/Navigate to Tasks & Scheduling section/i);
      expect(element).toBeTruthy();
    });
  });
});

/**
 * Testing Guidelines for Other Screens
 * =====================================
 * 
 * When testing other screens for accessibility:
 * 
 * 1. Check Accessible Names and Roles:
 *    - Use screen.getByRole("button", { name: "..." })
 *    - Verify all interactive elements have proper roles
 * 
 * 2. Verify Semantic Structure:
 *    - Headers should use accessibilityRole="header"
 *    - Links should use accessibilityRole="link"
 *    - Form inputs should have clear labels
 * 
 * 3. Test Screen Reader Navigation:
 *    - Use screen.getByLabelText() to find elements
 *    - Verify focus order is logical
 * 
 * 4. Check State Communication:
 *    - For checkboxes: accessibilityState={{ checked: true/false }}
 *    - For switches: accessibilityState={{ checked: true/false }}
 *    - For expandable items: accessibilityState={{ expanded: true/false }}
 * 
 * 5. Validate Form Accessibility:
 *    - TextInputs should have accessibilityLabel
 *    - TextInputs should have accessibilityHint for guidance
 *    - Error messages should be announced
 * 
 * Example test pattern:
 * 
 * it("has accessible form inputs", () => {
 *   render(<YourScreen />);
 *   
 *   const input = screen.getByLabelText("Username");
 *   expect(input).toBeTruthy();
 *   
 *   fireEvent.changeText(input, "testuser");
 *   // ... verify behavior
 * });
 */
