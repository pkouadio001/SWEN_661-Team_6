import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import SymptomsScreen from "../screens/SymptomsScreen";

const mockNavigate = jest.fn();
const mockQuitApp = jest.fn();
const mockRandomUUID = jest.fn(() => "mock-uuid-123");

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../components/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock("../components/TopBar", () => ({
  __esModule: true,
  default: ({
    onLogout,
    onQuit,
  }: {
    onLogout?: () => void;
    onQuit?: () => void;
  }) => (
    <div data-testid="topbar">
      <button onClick={onLogout}>Mock Logout</button>
      <button onClick={onQuit}>Mock Quit</button>
    </div>
  ),
}));

jest.mock("../screens/components/SymptomTrendsChart", () => ({
  __esModule: true,
  default: ({
    logs,
    range,
    onChangeRange,
  }: {
    logs: Array<{ symptom: string; severity: number }>;
    range: string;
    onChangeRange: (range: "weekly" | "monthly" | "yearly") => void;
  }) => (
    <div data-testid="trends-chart">
      <div data-testid="trends-range">Range: {range}</div>
      <div data-testid="trends-log-count">Logs: {logs.length}</div>
      <button onClick={() => onChangeRange("monthly")}>Set Monthly</button>
      <button onClick={() => onChangeRange("yearly")}>Set Yearly</button>
    </div>
  ),
}));

jest.mock("../screens/components/SymptomHistoryPanel", () => ({
  __esModule: true,
  default: ({
    logs,
    onDelete,
    onEdit,
  }: {
    logs: Array<{
      id: string;
      symptom: string;
      severity: number;
      notes?: string;
    }>;
    onDelete: (id: string) => void;
    onEdit: (id: string, patch: Record<string, unknown>) => void;
  }) => (
    <div data-testid="history-panel">
      <div data-testid="history-count">History Count: {logs.length}</div>
      {logs.map((log) => (
        <div key={log.id} data-testid={`history-item-${log.id}`}>
          <span>{log.symptom}</span>
          <span>{log.severity}</span>
          <button onClick={() => onDelete(log.id)}>Delete-{log.id}</button>
          <button onClick={() => onEdit(log.id, { symptom: "Edited Symptom", severity: 9 })}>
            Edit-{log.id}
          </button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../screens/components/LogSymptomModal", () => ({
  __esModule: true,
  default: ({
    onClose,
    onSave,
  }: {
    onClose: () => void;
    onSave: (data: {
      symptom: string;
      severity: number;
      notes: string;
      symptomType: string;
    }) => void;
  }) => (
    <div data-testid="log-symptom-modal">
      <button onClick={onClose}>Close Modal</button>
      <button
        onClick={() =>
          onSave({
            symptom: "Headache",
            severity: 7,
            notes: "Started after lunch",
            symptomType: "pain",
          })
        }
      >
        Save Symptom
      </button>
    </div>
  ),
}));

function renderScreen() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SymptomsScreen />
    </MemoryRouter>
  );
}

describe("SymptomsScreen interactive test", () => {
  const realDateNow = Date.now;
  const fixedNow = new Date("2026-03-07T10:00:00.000Z").getTime();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    Date.now = jest.fn(() => fixedNow);

    Object.defineProperty(window, "crypto", {
      value: {
        randomUUID: mockRandomUUID,
      },
      configurable: true,
    });

    (window as any).careconnect = {
      quitApp: mockQuitApp,
    };
  });

  afterEach(() => {
    Date.now = realDateNow;
  });

  test("renders shell, page title, default stats, and chart", () => {
    renderScreen();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("topbar")).toBeInTheDocument();

    expect(screen.getByText("Symptom Tracker")).toBeInTheDocument();
    expect(screen.getByText("Monitor and record your symptoms")).toBeInTheDocument();

    expect(screen.getByText("Today’s Logs")).toBeInTheDocument();
    expect(screen.getByText("Average Severity")).toBeInTheDocument();
    expect(screen.getByText("Most Common")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);

    expect(screen.getByTestId("trends-chart")).toBeInTheDocument();
    expect(screen.getByTestId("trends-range")).toHaveTextContent("Range: weekly");
    expect(screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 0");
  });

  test("loads logs from localStorage and computes stats correctly", () => {
    localStorage.setItem(
      "careconnect.symptomLogs",
      JSON.stringify([
        {
          id: "a1",
          symptom: "Nausea",
          severity: 4,
          notes: "Morning only",
          symptomType: "digestive",
          createdAt: fixedNow,
        },
        {
          id: "a2",
          symptom: "Headache",
          severity: 8,
          notes: "Afternoon",
          symptomType: "pain",
          createdAt: fixedNow,
        },
        {
          id: "a3",
          symptom: "Headache",
          severity: 6,
          notes: "Evening",
          symptomType: "pain",
          createdAt: fixedNow - 86400000,
        },
      ])
    );

    renderScreen();

    expect(screen.getByText("Today’s Logs")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Headache")).toBeInTheDocument();

    expect(screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 3");
  });

  test("opens log modal and saves a new symptom", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /\+ log symptom/i }));

    expect(screen.getByTestId("log-symptom-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save Symptom" }));

    expect(screen.queryByTestId("log-symptom-modal")).not.toBeInTheDocument();
    expect(mockRandomUUID).toHaveBeenCalled();

    const savedRaw = localStorage.getItem("careconnect.symptomLogs");
    expect(savedRaw).toBeTruthy();

    const saved = JSON.parse(savedRaw as string);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      id: "mock-uuid-123",
      symptom: "Headache",
      severity: 7,
      notes: "Started after lunch",
      symptomType: "pain",
      createdAt: fixedNow,
    });

    expect(screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 1");
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Headache")).toBeInTheDocument();
  });

  test("opens log modal and closes it without saving", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /\+ log symptom/i }));
    expect(screen.getByTestId("log-symptom-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close Modal" }));
    expect(screen.queryByTestId("log-symptom-modal")).not.toBeInTheDocument();

    expect(localStorage.getItem("careconnect.symptomLogs")).toBeNull();
  });

  test("changes trends range interactively", async () => {
    const user = userEvent.setup();
    renderScreen();

    expect(screen.getByTestId("trends-range")).toHaveTextContent("Range: weekly");

    await user.click(screen.getByRole("button", { name: "Set Monthly" }));
    expect(screen.getByTestId("trends-range")).toHaveTextContent("Range: monthly");

    await user.click(screen.getByRole("button", { name: "Set Yearly" }));
    expect(screen.getByTestId("trends-range")).toHaveTextContent("Range: yearly");
  });

  test("toggles history panel visibility", async () => {
    const user = userEvent.setup();
    renderScreen();

    const toggleButton = screen.getByRole("button", { name: /view history/i });

    expect(screen.queryByTestId("history-panel")).not.toBeInTheDocument();

    await user.click(toggleButton);
    expect(screen.getByTestId("history-panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide history/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide history/i }));
    expect(screen.queryByTestId("history-panel")).not.toBeInTheDocument();
  });

  test("deletes a history item and persists updated logs", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "careconnect.symptomLogs",
      JSON.stringify([
        {
          id: "log-1",
          symptom: "Headache",
          severity: 5,
          notes: "Test 1",
          symptomType: "pain",
          createdAt: fixedNow,
        },
        {
          id: "log-2",
          symptom: "Nausea",
          severity: 3,
          notes: "Test 2",
          symptomType: "digestive",
          createdAt: fixedNow,
        },
      ])
    );

    renderScreen();

    await user.click(screen.getByRole("button", { name: /view history/i }));

    expect(screen.getByTestId("history-panel")).toBeInTheDocument();
    expect(screen.getByTestId("history-count")).toHaveTextContent("History Count: 2");

    await user.click(screen.getByRole("button", { name: "Delete-log-1" }));

    expect(screen.getByTestId("history-count")).toHaveTextContent("History Count: 1");
    expect(screen.queryByTestId("history-item-log-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("history-item-log-2")).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem("careconnect.symptomLogs") as string);
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe("log-2");
  });

  test("edits a history item and persists updated logs", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "careconnect.symptomLogs",
      JSON.stringify([
        {
          id: "log-1",
          symptom: "Headache",
          severity: 5,
          notes: "Test 1",
          symptomType: "pain",
          createdAt: fixedNow,
        },
      ])
    );

    renderScreen();

    await user.click(screen.getByRole("button", { name: /view history/i }));
    expect(screen.getByTestId("history-item-log-1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit-log-1" }));

    const editedItem = screen.getByTestId("history-item-log-1");
    expect(within(editedItem).getByText("Edited Symptom")).toBeInTheDocument();
    expect(within(editedItem).getByText("9")).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem("careconnect.symptomLogs") as string);
    expect(saved).toHaveLength(1);
    expect(saved[0].symptom).toBe("Edited Symptom");
    expect(saved[0].severity).toBe(9);
  });

  test("handles invalid localStorage JSON by falling back to empty logs", () => {
    localStorage.setItem("careconnect.symptomLogs", "{bad json");

    renderScreen();

    expect(screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 0");
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });

  test("logout and quit actions are wired correctly", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: "Mock Logout" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    await user.click(screen.getByRole("button", { name: "Mock Quit" }));
    expect(mockQuitApp).toHaveBeenCalledTimes(1);
  });
});