import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import HistoryScreen from "../(tabs)/history";

afterAll(() => {
  (console.warn as jest.Mock).mockRestore?.();
});

// ✅ Mock AsyncStorage BEFORE importing the screen
jest.mock("@react-native-async-storage/async-storage", () => {
  const mock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  return {
    __esModule: true,
    default: mock, // ✅ IMPORTANT: `import AsyncStorage from ...` uses this
    ...mock, // (optional) also expose named funcs
  };
});

// ✅ expo-router mock
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  return {
    __esModule: true,
    router,
    default: { router },
    __mock: { push, replace, back },
  };
});

// ✅ ThemeContext mock (full shape to satisfy ThemeContextValue)
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    setHighContrastMode: jest.fn(),
    resetTheme: jest.fn(),
  }));

  return { __esModule: true, useTheme, __mock: { useTheme } };
});

// ✅ HealthLogsContext mock
jest.mock("@/context/HealthLogsContext", () => {
  const useHealthLogs = jest.fn(() => ({
    allEntries: [],
  }));

  return { __esModule: true, useHealthLogs, __mock: { useHealthLogs } };
});

const getRouterMocks = (): { push: jest.Mock } => {
  return require("expo-router").__mock as { push: jest.Mock };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};

const getHealthMocks = (): { useHealthLogs: jest.Mock } => {
  return require("@/context/HealthLogsContext").__mock as {
    useHealthLogs: jest.Mock;
  };
};

describe("HistoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // make calendar month predictable (Jan 2026)
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-25T12:00:00.000Z"));

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    getHealthMocks().useHealthLogs.mockReturnValue({
      allEntries: [
        {
          id: 1,
          type: "Blood Pressure",
          value: "120/80",
          date: "Jan 25, 2026",
          time: "10:30 AM",
          category: "vital",
        },
      ],
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders header + key UI", async () => {
    render(<HistoryScreen />);

    expect(screen.getByText("History")).toBeTruthy();
    expect(
      screen.getByText("Your complete health and notes timeline"),
    ).toBeTruthy();

    // back card
    expect(screen.getByText("← Back to Notes & Health Logs")).toBeTruthy();

    // filter button default
    expect(screen.getByText("Filter by Date")).toBeTruthy();

    // loads notes storage
    await waitFor(() =>
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("personalNotes"),
    );
  });

  it("renders health log entries from context (grouped by date)", async () => {
    render(<HistoryScreen />);

    // date group header should appear
    expect(await screen.findByText("Jan 25, 2026")).toBeTruthy();

    // health entry title is entry.type ("Blood Pressure")
    expect(screen.getByText("Blood Pressure")).toBeTruthy();
    expect(screen.getByText("120/80")).toBeTruthy();
  });

  it("loads personal notes from AsyncStorage and displays them", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([
        {
          title: "My Note",
          content: "Felt better today.",
          date: "Jan 24, 2026",
          time: "09:00 AM",
        },
      ]),
    );

    render(<HistoryScreen />);

    // note group date
    expect(await screen.findByText("Jan 24, 2026")).toBeTruthy();

    // note content
    expect(screen.getByText("My Note")).toBeTruthy();
    expect(screen.getByText("Felt better today.")).toBeTruthy();
  });

  it("navigates to /health when pressing back buttons", () => {
    render(<HistoryScreen />);

    fireEvent.press(screen.getByText("← Back to Notes & Health Logs"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/health");
  });

  it("renders in high-contrast mode (smoke)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<HistoryScreen />);

    expect(screen.getByText("History")).toBeTruthy();
    expect(screen.getByText("Filter by Date")).toBeTruthy();
  });
});
