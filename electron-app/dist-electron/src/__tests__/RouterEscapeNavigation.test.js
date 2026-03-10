"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const react_2 = require("react");
const react_router_dom_1 = require("react-router-dom");
const router_1 = __importDefault(require("../app/router"));
jest.mock("../screens/LoginScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Login Screen" }),
}));
jest.mock("../screens/DashboardScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Dashboard Screen" }),
}));
jest.mock("../screens/MyHealthScreen", () => ({
    __esModule: true,
    default: () => {
        const [checked, setChecked] = (0, react_2.useState)(false);
        const [customChecked, setCustomChecked] = (0, react_2.useState)(false);
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { children: ["My Health Screen", (0, jsx_runtime_1.jsx)("input", { "aria-label": "test-check", type: "checkbox", checked: checked, onChange: () => setChecked((prev) => !prev) })] }), (0, jsx_runtime_1.jsx)("div", { "aria-checked": customChecked, "aria-label": "custom-check", role: "checkbox", tabIndex: 0, onClick: () => setCustomChecked((prev) => !prev), children: "Custom Checkbox" })] }));
    },
}));
jest.mock("../screens/MedicationsScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Medications Screen" }),
}));
jest.mock("../screens/SizeDemoScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Size Demo Screen" }),
}));
jest.mock("../screens/ExercisesScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Exercises Screen" }),
}));
jest.mock("../screens/MyInfoScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "My Info Screen" }),
}));
jest.mock("../screens/SymptomsScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Symptoms Screen" }),
}));
jest.mock("../screens/EmergencyScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Emergency Screen" }),
}));
jest.mock("../screens/ActivitiesScreen", () => ({
    __esModule: true,
    default: () => (0, jsx_runtime_1.jsx)("div", { children: "Activities Screen" }),
}));
describe("Router Escape Navigation", () => {
    beforeEach(() => {
        localStorage.setItem("careconnect.authenticated", "true");
    });
    test("Escape navigates to dashboard from app routes", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/my-health"], children: (0, jsx_runtime_1.jsx)(router_1.default, {}) }));
        expect(react_1.screen.getByText("My Health Screen")).toBeInTheDocument();
        react_1.fireEvent.keyDown(document, { key: "Escape" });
        expect(react_1.screen.getByText("Dashboard Screen")).toBeInTheDocument();
    });
    test("Escape does not navigate away from login", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/login"], children: (0, jsx_runtime_1.jsx)(router_1.default, {}) }));
        expect(react_1.screen.getByText("Login Screen")).toBeInTheDocument();
        react_1.fireEvent.keyDown(document, { key: "Escape" });
        expect(react_1.screen.getByText("Login Screen")).toBeInTheDocument();
    });
    test("Escape does not go to dashboard when unauthenticated", () => {
        localStorage.setItem("careconnect.authenticated", "false");
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/my-health"], children: (0, jsx_runtime_1.jsx)(router_1.default, {}) }));
        expect(react_1.screen.getByText("My Health Screen")).toBeInTheDocument();
        react_1.fireEvent.keyDown(document, { key: "Escape" });
        expect(react_1.screen.getByText("Login Screen")).toBeInTheDocument();
    });
    test("Enter toggles focused checkbox", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/my-health"], children: (0, jsx_runtime_1.jsx)(router_1.default, {}) }));
        const checkbox = react_1.screen.getByRole("checkbox", { name: "test-check" });
        checkbox.focus();
        expect(checkbox.checked).toBe(false);
        react_1.fireEvent.keyDown(document, { key: "Enter" });
        expect(checkbox.checked).toBe(true);
    });
    test("Enter toggles focused custom role checkbox", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/my-health"], children: (0, jsx_runtime_1.jsx)(router_1.default, {}) }));
        const customCheckbox = react_1.screen.getByRole("checkbox", {
            name: "custom-check",
        });
        customCheckbox.focus();
        expect(customCheckbox).toHaveAttribute("aria-checked", "false");
        react_1.fireEvent.keyDown(document, { key: "Enter" });
        expect(customCheckbox).toHaveAttribute("aria-checked", "true");
    });
});
