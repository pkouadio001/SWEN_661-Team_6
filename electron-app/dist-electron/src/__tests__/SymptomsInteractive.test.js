"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const react_router_dom_1 = require("react-router-dom");
const SymptomsScreen_1 = __importDefault(require("../screens/SymptomsScreen"));
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
    default: () => (0, jsx_runtime_1.jsx)("div", { "data-testid": "sidebar", children: "Sidebar" }),
}));
jest.mock("../components/TopBar", () => ({
    __esModule: true,
    default: ({ onLogout, onQuit, }) => ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "topbar", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onLogout, children: "Mock Logout" }), (0, jsx_runtime_1.jsx)("button", { onClick: onQuit, children: "Mock Quit" })] })),
}));
jest.mock("../screens/components/SymptomTrendsChart", () => ({
    __esModule: true,
    default: ({ logs, range, onChangeRange, }) => ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "trends-chart", children: [(0, jsx_runtime_1.jsxs)("div", { "data-testid": "trends-range", children: ["Range: ", range] }), (0, jsx_runtime_1.jsxs)("div", { "data-testid": "trends-log-count", children: ["Logs: ", logs.length] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onChangeRange("monthly"), children: "Set Monthly" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onChangeRange("yearly"), children: "Set Yearly" })] })),
}));
jest.mock("../screens/components/SymptomHistoryPanel", () => ({
    __esModule: true,
    default: ({ logs, onDelete, onEdit, }) => ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "history-panel", children: [(0, jsx_runtime_1.jsxs)("div", { "data-testid": "history-count", children: ["History Count: ", logs.length] }), logs.map((log) => ((0, jsx_runtime_1.jsxs)("div", { "data-testid": `history-item-${log.id}`, children: [(0, jsx_runtime_1.jsx)("span", { children: log.symptom }), (0, jsx_runtime_1.jsx)("span", { children: log.severity }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onDelete(log.id), children: ["Delete-", log.id] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onEdit(log.id, { symptom: "Edited Symptom", severity: 9 }), children: ["Edit-", log.id] })] }, log.id)))] })),
}));
jest.mock("../screens/components/LogSymptomModal", () => ({
    __esModule: true,
    default: ({ onClose, onSave, }) => ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "log-symptom-modal", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, children: "Close Modal" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onSave({
                    symptom: "Headache",
                    severity: 7,
                    notes: "Started after lunch",
                    symptomType: "pain",
                }), children: "Save Symptom" })] })),
}));
function renderScreen() {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: (0, jsx_runtime_1.jsx)(SymptomsScreen_1.default, {}) }));
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
        window.careconnect = {
            quitApp: mockQuitApp,
        };
    });
    afterEach(() => {
        Date.now = realDateNow;
    });
    test("renders shell, page title, default stats, and chart", () => {
        renderScreen();
        expect(react_1.screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("topbar")).toBeInTheDocument();
        expect(react_1.screen.getByText("Symptom Tracker")).toBeInTheDocument();
        expect(react_1.screen.getByText("Monitor and record your symptoms")).toBeInTheDocument();
        expect(react_1.screen.getByText("Today’s Logs")).toBeInTheDocument();
        expect(react_1.screen.getByText("Average Severity")).toBeInTheDocument();
        expect(react_1.screen.getByText("Most Common")).toBeInTheDocument();
        expect(react_1.screen.getByText("0")).toBeInTheDocument();
        expect(react_1.screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
        expect(react_1.screen.getByTestId("trends-chart")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("trends-range")).toHaveTextContent("Range: weekly");
        expect(react_1.screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 0");
    });
    test("loads logs from localStorage and computes stats correctly", () => {
        localStorage.setItem("careconnect.symptomLogs", JSON.stringify([
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
        ]));
        renderScreen();
        expect(react_1.screen.getByText("Today’s Logs")).toBeInTheDocument();
        expect(react_1.screen.getByText("2")).toBeInTheDocument();
        expect(react_1.screen.getByText("6")).toBeInTheDocument();
        expect(react_1.screen.getByText("Headache")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 3");
    });
    test("opens log modal and saves a new symptom", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: /\+ log symptom/i }));
        expect(react_1.screen.getByTestId("log-symptom-modal")).toBeInTheDocument();
        await user.click(react_1.screen.getByRole("button", { name: "Save Symptom" }));
        expect(react_1.screen.queryByTestId("log-symptom-modal")).not.toBeInTheDocument();
        expect(mockRandomUUID).toHaveBeenCalled();
        const savedRaw = localStorage.getItem("careconnect.symptomLogs");
        expect(savedRaw).toBeTruthy();
        const saved = JSON.parse(savedRaw);
        expect(saved).toHaveLength(1);
        expect(saved[0]).toMatchObject({
            id: "mock-uuid-123",
            symptom: "Headache",
            severity: 7,
            notes: "Started after lunch",
            symptomType: "pain",
            createdAt: fixedNow,
        });
        expect(react_1.screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 1");
        expect(react_1.screen.getByText("1")).toBeInTheDocument();
        expect(react_1.screen.getByText("7")).toBeInTheDocument();
        expect(react_1.screen.getByText("Headache")).toBeInTheDocument();
    });
    test("opens log modal and closes it without saving", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: /\+ log symptom/i }));
        expect(react_1.screen.getByTestId("log-symptom-modal")).toBeInTheDocument();
        await user.click(react_1.screen.getByRole("button", { name: "Close Modal" }));
        expect(react_1.screen.queryByTestId("log-symptom-modal")).not.toBeInTheDocument();
        expect(localStorage.getItem("careconnect.symptomLogs")).toBeNull();
    });
    test("changes trends range interactively", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        expect(react_1.screen.getByTestId("trends-range")).toHaveTextContent("Range: weekly");
        await user.click(react_1.screen.getByRole("button", { name: "Set Monthly" }));
        expect(react_1.screen.getByTestId("trends-range")).toHaveTextContent("Range: monthly");
        await user.click(react_1.screen.getByRole("button", { name: "Set Yearly" }));
        expect(react_1.screen.getByTestId("trends-range")).toHaveTextContent("Range: yearly");
    });
    test("toggles history panel visibility", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        const toggleButton = react_1.screen.getByRole("button", { name: /view history/i });
        expect(react_1.screen.queryByTestId("history-panel")).not.toBeInTheDocument();
        await user.click(toggleButton);
        expect(react_1.screen.getByTestId("history-panel")).toBeInTheDocument();
        expect(react_1.screen.getByRole("button", { name: /hide history/i })).toBeInTheDocument();
        await user.click(react_1.screen.getByRole("button", { name: /hide history/i }));
        expect(react_1.screen.queryByTestId("history-panel")).not.toBeInTheDocument();
    });
    test("deletes a history item and persists updated logs", async () => {
        const user = user_event_1.default.setup();
        localStorage.setItem("careconnect.symptomLogs", JSON.stringify([
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
        ]));
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: /view history/i }));
        expect(react_1.screen.getByTestId("history-panel")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("history-count")).toHaveTextContent("History Count: 2");
        await user.click(react_1.screen.getByRole("button", { name: "Delete-log-1" }));
        expect(react_1.screen.getByTestId("history-count")).toHaveTextContent("History Count: 1");
        expect(react_1.screen.queryByTestId("history-item-log-1")).not.toBeInTheDocument();
        expect(react_1.screen.getByTestId("history-item-log-2")).toBeInTheDocument();
        const saved = JSON.parse(localStorage.getItem("careconnect.symptomLogs"));
        expect(saved).toHaveLength(1);
        expect(saved[0].id).toBe("log-2");
    });
    test("edits a history item and persists updated logs", async () => {
        const user = user_event_1.default.setup();
        localStorage.setItem("careconnect.symptomLogs", JSON.stringify([
            {
                id: "log-1",
                symptom: "Headache",
                severity: 5,
                notes: "Test 1",
                symptomType: "pain",
                createdAt: fixedNow,
            },
        ]));
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: /view history/i }));
        expect(react_1.screen.getByTestId("history-item-log-1")).toBeInTheDocument();
        await user.click(react_1.screen.getByRole("button", { name: "Edit-log-1" }));
        const editedItem = react_1.screen.getByTestId("history-item-log-1");
        expect((0, react_1.within)(editedItem).getByText("Edited Symptom")).toBeInTheDocument();
        expect((0, react_1.within)(editedItem).getByText("9")).toBeInTheDocument();
        const saved = JSON.parse(localStorage.getItem("careconnect.symptomLogs"));
        expect(saved).toHaveLength(1);
        expect(saved[0].symptom).toBe("Edited Symptom");
        expect(saved[0].severity).toBe(9);
    });
    test("handles invalid localStorage JSON by falling back to empty logs", () => {
        localStorage.setItem("careconnect.symptomLogs", "{bad json");
        renderScreen();
        expect(react_1.screen.getByTestId("trends-log-count")).toHaveTextContent("Logs: 0");
        expect(react_1.screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
    });
    test("logout and quit actions are wired correctly", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: "Mock Logout" }));
        expect(mockNavigate).toHaveBeenCalledWith("/login");
        await user.click(react_1.screen.getByRole("button", { name: "Mock Quit" }));
        expect(mockQuitApp).toHaveBeenCalledTimes(1);
    });
});
