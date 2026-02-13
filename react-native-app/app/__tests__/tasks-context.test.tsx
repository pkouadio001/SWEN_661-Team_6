// app/_tests_/tasks-context.test.tsx
import { TasksProvider, useTasks } from "@/context/TasksContext";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

// ✅ AsyncStorage mock (prevents "NativeModule: AsyncStorage is null")
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: (...args: any[]) => mockSetItem(...args),
  },
}));

function Consumer() {
  const {
    allTasks,
    todaysPendingCount,
    todaysCompletedCount,
    toggleTask,
    addTask,
    deleteTask,
    updateTask,
  } = useTasks();
  return (
    <View>
      <Text testID="countAll">{String(allTasks.length)}</Text>
      <Text testID="pending">{String(todaysPendingCount)}</Text>
      <Text testID="completed">{String(todaysCompletedCount)}</Text>

      <Text testID="task2Completed">
        {String(allTasks.find((t) => t.id === 2)?.completed)}
      </Text>

      <Pressable testID="toggle2" onPress={() => toggleTask(2)}>
        <Text>toggle2</Text>
      </Pressable>

      <Pressable
        testID="addCustom"
        onPress={() =>
          addTask({
            title: "Custom task",
            time: "Jan 25 at 7:00 PM",
            completed: false,
          })
        }
      >
        <Text>addCustom</Text>
      </Pressable>

      <Pressable
        testID="updateCustom"
        onPress={() => updateTask(10, { title: "Updated custom" })}
      >
        <Text>updateCustom</Text>
      </Pressable>

      <Pressable testID="deleteCustom" onPress={() => deleteTask(10)}>
        <Text>deleteCustom</Text>
      </Pressable>
    </View>
  );
}

describe("TasksContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // ✅ Make "today" deterministic so todayPrefix becomes "Jan 25"
    jest.setSystemTime(new Date("2026-01-25T12:00:00.000Z"));

    mockGetItem.mockReset();
    mockSetItem.mockReset();

    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with default tasks and correct today's counts", async () => {
    render(
      <TasksProvider>
        <Consumer />
      </TasksProvider>,
    );

    // defaultTasks length = 9
    expect(screen.getByTestId("countAll").props.children).toBe("9");

    // For Jan 25 defaults: id1 true, id2 false, id3 false, id4 false => completed=1 pending=3
    await waitFor(() => {
      expect(screen.getByTestId("completed").props.children).toBe("1");
      expect(screen.getByTestId("pending").props.children).toBe("3");
    });
  });

  it("loads custom tasks from AsyncStorage and assigns ids after existing max id", async () => {
    // Stored tasks are Omit<Task,"id">[]
    mockGetItem.mockResolvedValue(
      JSON.stringify([
        { title: "Stored A", time: "Jan 25 at 9:30 PM", completed: false },
        { title: "Stored B", time: "Jan 26 at 9:00 AM", completed: true },
      ]),
    );

    render(
      <TasksProvider>
        <Consumer />
      </TasksProvider>,
    );

    // defaults (9) + stored (2) => 11
    await waitFor(() => {
      expect(screen.getByTestId("countAll").props.children).toBe("11");
    });

    // should have persisted custom tasks back (effect runs)
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(
        "tasks_v1",
        JSON.stringify([
          { title: "Stored A", time: "Jan 25 at 9:30 PM", completed: false },
          { title: "Stored B", time: "Jan 26 at 9:00 AM", completed: true },
        ]),
      );
    });
  });

  it("toggleTask flips completed and triggers persistence", async () => {
    render(
      <TasksProvider>
        <Consumer />
      </TasksProvider>,
    );

    // Task id 2 starts false
    expect(screen.getByTestId("task2Completed").props.children).toBe("false");

    fireEvent.press(screen.getByTestId("toggle2"));

    await waitFor(() => {
      expect(screen.getByTestId("task2Completed").props.children).toBe("true");
    });

    // persistence runs (it saves only custom tasks, but still calls setItem)
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("tasks_v1", expect.any(String));
    });
  });

  it("addTask adds a custom task, then updateTask and deleteTask work", async () => {
    render(
      <TasksProvider>
        <Consumer />
      </TasksProvider>,
    );
    expect(screen.getByTestId("countAll").props.children).toBe("9");

    fireEvent.press(screen.getByTestId("addCustom"));

    // after adding => 10
    await waitFor(() => {
      expect(screen.getByTestId("countAll").props.children).toBe("10");
    });

    // update custom id 10
    fireEvent.press(screen.getByTestId("updateCustom"));

    // delete custom id 10
    fireEvent.press(screen.getByTestId("deleteCustom"));

    await waitFor(() => {
      expect(screen.getByTestId("countAll").props.children).toBe("9");
    });

    // persistence should have been called at least once
    expect(mockSetItem).toHaveBeenCalledWith("tasks_v1", expect.any(String));
  });

  it("persists only custom tasks (id > defaultTasks.length) to AsyncStorage", async () => {
    render(
      <TasksProvider>
        <Consumer />
      </TasksProvider>,
    );

    fireEvent.press(screen.getByTestId("addCustom")); // creates id 10 (custom)

    await waitFor(() => {
      // setItem should contain ONLY the custom task without id
      expect(mockSetItem).toHaveBeenLastCalledWith(
        "tasks_v1",
        JSON.stringify([
          { title: "Custom task", time: "Jan 25 at 7:00 PM", completed: false },
        ]),
      );
    });
  });
});
