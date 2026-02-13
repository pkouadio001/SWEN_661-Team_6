// app/_tests_/today-tasks.test.tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import TodayTasksScreen from "../(tabs)/today-tasks"; // ✅ adjust path if yours differs

// -------------------- expo-router mock --------------------
jest.mock("expo-router", () => {
  const push = jest.fn();

  return {
    __esModule: true,
    router: { push },
    __mock: { push },
  };
});
const getRouterMocks = (): { push: jest.Mock } => {
  return require("expo-router").__mock as { push: jest.Mock };
};

// -------------------- ThemeContext mock --------------------
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({ highContrastMode: false }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
});

const getThemeMocks = (): { useTheme: jest.Mock } => {
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};
jest.mock("@/context/TasksContext", () => {
  const useTasks = jest.fn();
  return { __esModule: true, useTasks, __mock: { useTasks } };
});

const getTasksMocks = (): { useTasks: jest.Mock } => {
  return require("@/context/TasksContext").__mock as { useTasks: jest.Mock };
};

type Task = {
  id: number;
  title: string;
  time: string; // e.g. "Jan 25 at 8:00 AM"
  completed: boolean;
};

const baseTasks: Task[] = [
  {
    id: 1,
    title: "Take medication",
    time: "Jan 25 at 8:00 AM",
    completed: false,
  },
  {
    id: 2,
    title: "Physical therapy",
    time: "Jan 25 at 10:30 AM",
    completed: true,
  },
  { id: 3, title: "Call doctor", time: "Jan 26 at 1:00 PM", completed: false },
];
describe("TodayTasksScreen", () => {
  const toggleTask = jest.fn();
  const deleteTask = jest.fn();
  const updateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: false });

    getTasksMocks().useTasks.mockReturnValue({
      allTasks: baseTasks,
      toggleTask,
      deleteTask,
      updateTask,
    });
  });

  it("renders header + main UI", () => {
    render(<TodayTasksScreen />);

    // Title appears twice (header + card)
    expect(screen.getAllByText("Today's Tasks").length).toBeGreaterThanOrEqual(
      1,
    );

    expect(screen.getByText("Your daily care routine")).toBeTruthy();
    expect(screen.getByText("← Back to Tasks & Scheduling")).toBeTruthy();

    // Toggle tabs
    expect(screen.getByText("Schedule")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();

    // Tasks for Jan 25 should show
    expect(screen.getByText("Take medication")).toBeTruthy();
    expect(screen.getByText("Physical therapy")).toBeTruthy();

    // Add button
    expect(screen.getByText("+ Add")).toBeTruthy();
  });

  it("navigates to /add-task when pressing + Add", () => {
    render(<TodayTasksScreen />);

    fireEvent.press(screen.getByText("+ Add"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/add-task");
  });
  it("toggles a task when pressing the checkbox", () => {
    render(<TodayTasksScreen />);

    // Only completed tasks render a visible checkmark "✓"
    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBeGreaterThan(0);

    fireEvent.press(checkmarks[0]);

    // In our baseTasks, the completed task is id=2
    expect(toggleTask).toHaveBeenCalledWith(2);
  });

  it("opens menu and navigates through Edit flow (Save Changes calls updateTask)", () => {
    render(<TodayTasksScreen />);

    // Open menu for "Take medication"
    fireEvent.press(screen.getAllByText("⋯")[0]);

    fireEvent.press(screen.getByText("Edit Task"));

    // Edit modal should show
    expect(screen.getByText("Edit Task")).toBeTruthy();
    expect(screen.getByText("Save Changes")).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText("Task title"),
      "Updated title",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Jan 25, 2026"),
      "Jan 25, 2026",
    );
    fireEvent.changeText(screen.getByPlaceholderText("8:00 AM"), "9:15 AM");

    fireEvent.press(screen.getByText("Save Changes"));

    expect(updateTask).toHaveBeenCalledTimes(1);

    const [taskId, payload] = updateTask.mock.calls[0];
    expect(taskId).toBe(1);
    expect(payload.title).toBe("Updated title");
    // formatDateTime() returns: "Jan 25, 2026 at 9:15 AM" -> but date gets shortened to "Jan 25"
    // because your formatter converts to "Jan 25" style if date isn't already short;
    // Here we gave "Jan 25, 2026", which becomes "Jan 25" (short) and adds "at ..."
    expect(payload.time).toContain("Jan 25");
    expect(payload.time).toContain("9:15");
  });
  it("opens menu and completes Delete flow (confirm calls deleteTask)", () => {
    render(<TodayTasksScreen />);

    fireEvent.press(screen.getAllByText("⋯")[0]);
    fireEvent.press(screen.getAllByText("Delete Task")[0]);

    // modal opened: now there are multiple "Delete Task" (title + confirm button)
    expect(screen.getAllByText("Delete Task").length).toBeGreaterThan(1);

    expect(
      screen.getByText(
        "Are you sure you want to delete this task? This action cannot be undone.",
      ),
    ).toBeTruthy();

    // Confirm delete (button label is also "Delete Task" inside modal)
    // There are multiple "Delete Task" texts now (title + button), so use getAllByText and press the button-ish one.
    const deleteTaskEls = screen.getAllByText("Delete Task");
    fireEvent.press(deleteTaskEls[deleteTaskEls.length - 1]); // confirm button (last one)
    expect(deleteTask).toHaveBeenCalledWith(1);
  });

  it("switches to Calendar view and selecting a day shows 'Tasks for ...'", () => {
    render(<TodayTasksScreen />);

    fireEvent.press(screen.getByText("Calendar"));

    // Pick day 25 in calendar grid
    fireEvent.press(screen.getByText("25"));

    // Now it should show tasks for selected date section
    expect(screen.getByText(/Tasks for/i)).toBeTruthy();
  });

  it("renders in high-contrast mode (smoke)", () => {
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: true });

    render(<TodayTasksScreen />);

    expect(screen.getAllByText("Today's Tasks").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Schedule")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();
  });
});
