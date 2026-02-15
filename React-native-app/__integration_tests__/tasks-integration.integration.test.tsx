/**
 * Integration Test: Tasks Context with Add Task Form
 * 
 * This test verifies the integration between the TasksContext
 * and the Add Task form, ensuring tasks are properly added and persisted.
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
  const usePathname = jest.fn(() => "/today-tasks");

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
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import AddTaskScreen from "../app/add-task";
import TodayTasksScreen from "../app/(tabs)/today-tasks";
import { TasksProvider } from "@/context/TasksContext";
import { ThemeProvider } from "@/context/ThemeContext";

const getRouterMocks = () => {
  return require("expo-router").__mock;
};

describe("Integration: TasksContext with Add Task Form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds a new task through the form and navigates back", async () => {
    // Mock Alert.alert to avoid actual alerts
    const mockAlert = jest.fn();
    jest.spyOn(require("react-native").Alert, "alert").mockImplementation(mockAlert);

    // Render the add task screen with providers
    render(
      <ThemeProvider>
        <TasksProvider>
          <AddTaskScreen />
        </TasksProvider>
      </ThemeProvider>
    );

    // Verify add task screen renders
    expect(screen.getByText("Add Task")).toBeTruthy();

    // Fill in task details
    fireEvent.changeText(screen.getByPlaceholderText("Task title..."), "Take vitamins");
    
    // Fill in date (YYYY-MM-DD format)
    fireEvent.changeText(screen.getByPlaceholderText("YYYY-MM-DD"), "2026-02-15");
    
    // Fill in time (HH:mm format)
    fireEvent.changeText(screen.getByPlaceholderText("HH:mm"), "09:30");

    // Submit the form
    fireEvent.press(screen.getByText("Save Task"));

    // Should navigate back to today-tasks
    await waitFor(() => {
      expect(getRouterMocks().push).toHaveBeenCalledWith("/today-tasks");
    });
  });

  it("validates required fields in add task form", () => {
    const mockAlert = jest.fn();
    jest.spyOn(require("react-native").Alert, "alert").mockImplementation(mockAlert);

    render(
      <ThemeProvider>
        <TasksProvider>
          <AddTaskScreen />
        </TasksProvider>
      </ThemeProvider>
    );

    // Try to submit without filling required fields
    fireEvent.press(screen.getByText("Save Task"));

    // Should show alert
    expect(mockAlert).toHaveBeenCalledWith(
      "Missing info",
      "Please fill in all fields."
    );

    // Should not navigate
    expect(getRouterMocks().push).not.toHaveBeenCalled();
  });

  it("displays today tasks screen", () => {
    render(
      <ThemeProvider>
        <TasksProvider>
          <TodayTasksScreen />
        </TasksProvider>
      </ThemeProvider>
    );

    // Verify screen renders with title
    expect(screen.getByText("Today's Tasks")).toBeTruthy();
  });
});
