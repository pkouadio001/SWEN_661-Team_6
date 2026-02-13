// app/_tests_/add-task.test.tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import AddTaskScreen from "../add-task";

/**
 * expo-router mock (safe: no out-of-scope refs)
 */
jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    router: { push },
    __mock: { push },
  };
});

const getRouterMocks = (): { push: jest.Mock } => {
   
  const mod = require("expo-router");
  return mod.__mock as { push: jest.Mock };
};

/**
 * ThemeContext mock (safe)
 */
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({ highContrastMode: false }));
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
 * TasksContext mock (safe)
 */
jest.mock("@/context/TasksContext", () => {
  const addTask = jest.fn();
  const useTasks = jest.fn(() => ({ addTask }));
  return {
    useTasks,
    __mock: { useTasks, addTask },
  };
});

const getTasksMocks = (): { useTasks: jest.Mock; addTask: jest.Mock } => {
   
  const mod = require("@/context/TasksContext");
  return mod.__mock as { useTasks: jest.Mock; addTask: jest.Mock };
};

describe("AddTaskScreen (app/add-task.tsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // default behavior for each test
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: false });

    // Ensure useTasks returns the addTask mock
    const { useTasks, addTask } = getTasksMocks();
    useTasks.mockReturnValue({ addTask });

    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  it("renders key UI sections and fields", () => {
    render(<AddTaskScreen />);

    expect(screen.getByText("Add New Task")).toBeTruthy();
    expect(screen.getByText("Create a task for your routine")).toBeTruthy();

    expect(screen.getByText("Task Details")).toBeTruthy();
    expect(screen.getByText("Fill in the information below")).toBeTruthy();

    expect(screen.getByText("Task Title")).toBeTruthy();
    expect(screen.getByText("Date")).toBeTruthy();
    expect(screen.getByText("Time")).toBeTruthy();

    expect(
      screen.getByPlaceholderText("e.g., Take morning medication"),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText("YYYY-MM-DD (e.g., 2026-01-25)"),
    ).toBeTruthy();
    expect(screen.getByPlaceholderText("HH:mm (e.g., 08:00)")).toBeTruthy();

    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Add Task")).toBeTruthy();

    expect(screen.getAllByText("Stored as: —")).toHaveLength(2);
  });

  it("updates the 'Stored as' previews when date/time inputs change", () => {
    render(<AddTaskScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("YYYY-MM-DD (e.g., 2026-01-25)"),
      "2026-01-25",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("HH:mm (e.g., 08:00)"),
      "08:00",
    );

    expect(screen.getByText("Stored as: Jan 25")).toBeTruthy();
    expect(screen.getByText("Stored as: 8:00 AM")).toBeTruthy();
  });

  it("shows an alert and does not save if any field is missing", () => {
    render(<AddTaskScreen />);

    fireEvent.press(screen.getByText("Add Task"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Missing info",
      "Please fill in all fields.",
    );
    expect(getTasksMocks().addTask).not.toHaveBeenCalled();
    expect(getRouterMocks().push).not.toHaveBeenCalled();
  });

  it("calls addTask with formatted date/time and navigates back on valid save", () => {
    render(<AddTaskScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("e.g., Take morning medication"),
      "  Take meds  ",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("YYYY-MM-DD (e.g., 2026-01-25)"),
      "2026-01-25",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("HH:mm (e.g., 08:00)"),
      "13:05",
    );

    fireEvent.press(screen.getByText("Add Task"));

    expect(Alert.alert).not.toHaveBeenCalled();

    expect(getTasksMocks().addTask).toHaveBeenCalledWith({
      title: "Take meds",
      time: "Jan 25 at 1:05 PM",
      completed: false,
    });

    expect(getRouterMocks().push).toHaveBeenCalledWith("/today-tasks");
  });

  it("navigates back when pressing Cancel", () => {
    render(<AddTaskScreen />);
    fireEvent.press(screen.getByText("Cancel"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/today-tasks");
  });

  it("navigates back when pressing the back arrow", () => {
    render(<AddTaskScreen />);
    fireEvent.press(screen.getByText("←"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/today-tasks");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: true });

    render(<AddTaskScreen />);

    expect(screen.getByText("Add New Task")).toBeTruthy();
    expect(screen.getByText("Add Task")).toBeTruthy();
  });

  it("accessibility: (current code) inputs are discoverable by placeholder; add accessibilityLabel to strengthen tests", () => {
    render(<AddTaskScreen />);

    expect(
      screen.getByPlaceholderText("e.g., Take morning medication"),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText("YYYY-MM-DD (e.g., 2026-01-25)"),
    ).toBeTruthy();
    expect(screen.getByPlaceholderText("HH:mm (e.g., 08:00)")).toBeTruthy();
  });
});
