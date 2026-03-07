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
const MyInfoScreen_1 = __importDefault(require("../screens/MyInfoScreen"));
const mockNavigate = jest.fn();
const mockQuitApp = jest.fn();
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
function renderScreen() {
    return (0, react_1.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: (0, jsx_runtime_1.jsx)(MyInfoScreen_1.default, {}) }));
}
describe("MyInfoScreen interactive test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        window.careconnect = {
            quitApp: mockQuitApp,
        };
    });
    test("renders the shell, title, and default profile data", () => {
        renderScreen();
        expect(react_1.screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(react_1.screen.getByTestId("topbar")).toBeInTheDocument();
        expect(react_1.screen.getByText("User Information")).toBeInTheDocument();
        expect(react_1.screen.getByText("Manage your personal and medical information")).toBeInTheDocument();
        expect(react_1.screen.getByText("Robert")).toBeInTheDocument();
        expect(react_1.screen.getByText("Johnson")).toBeInTheDocument();
        expect(react_1.screen.getByText("04/15/1955")).toBeInTheDocument();
        expect(react_1.screen.getByText("(555) 234-5678")).toBeInTheDocument();
        expect(react_1.screen.getByText("robert.johnson@email.com")).toBeInTheDocument();
        expect(react_1.screen.getByText("456 Oak Avenue")).toBeInTheDocument();
        expect(react_1.screen.getByText("San Francisco")).toBeInTheDocument();
        expect(react_1.screen.getByText("CA")).toBeInTheDocument();
        expect(react_1.screen.getByText("94105")).toBeInTheDocument();
        expect(react_1.screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
        expect(react_1.screen.getByText("O+")).toBeInTheDocument();
        expect(react_1.screen.getByText("Blue Cross Blue Shield")).toBeInTheDocument();
    });
    test("enters edit mode for Personal Information, saves changes, and persists to localStorage", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        const personalSectionTitle = react_1.screen.getByText("Personal Information");
        const personalPanel = personalSectionTitle.closest(".panel");
        expect(personalPanel).toBeInTheDocument();
        const editButton = (0, react_1.within)(personalPanel).getByRole("button", { name: /edit/i });
        await user.click(editButton);
        const firstNameInput = (0, react_1.within)(personalPanel).getByDisplayValue("Robert");
        const lastNameInput = (0, react_1.within)(personalPanel).getByDisplayValue("Johnson");
        const emailInput = (0, react_1.within)(personalPanel).getByDisplayValue("robert.johnson@email.com");
        await user.clear(firstNameInput);
        await user.type(firstNameInput, "Bernabe");
        await user.clear(lastNameInput);
        await user.type(lastNameInput, "Garcia");
        await user.clear(emailInput);
        await user.type(emailInput, "bernabe.garcia@email.com");
        const saveButton = (0, react_1.within)(personalPanel).getByRole("button", { name: /save/i });
        await user.click(saveButton);
        expect(react_1.screen.getByText("Bernabe")).toBeInTheDocument();
        expect(react_1.screen.getByText("Garcia")).toBeInTheDocument();
        expect(react_1.screen.getByText("bernabe.garcia@email.com")).toBeInTheDocument();
        const savedRaw = localStorage.getItem("careconnect.profile");
        expect(savedRaw).toBeTruthy();
        const saved = JSON.parse(savedRaw);
        expect(saved.personal.firstName).toBe("Bernabe");
        expect(saved.personal.lastName).toBe("Garcia");
        expect(saved.personal.email).toBe("bernabe.garcia@email.com");
    });
    test("cancels Personal Information edits and restores original values", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        const personalPanel = react_1.screen
            .getByText("Personal Information")
            .closest(".panel");
        await user.click((0, react_1.within)(personalPanel).getByRole("button", { name: /edit/i }));
        const firstNameInput = (0, react_1.within)(personalPanel).getByDisplayValue("Robert");
        await user.clear(firstNameInput);
        await user.type(firstNameInput, "ChangedName");
        await user.click((0, react_1.within)(personalPanel).getByRole("button", { name: /cancel/i }));
        expect(react_1.screen.getByText("Robert")).toBeInTheDocument();
        expect(react_1.screen.queryByDisplayValue("ChangedName")).not.toBeInTheDocument();
        expect(localStorage.getItem("careconnect.profile")).toBeNull();
    });
    test("saves Address section changes independently", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        const addressPanel = react_1.screen.getByText("Home Address").closest(".panel");
        await user.click((0, react_1.within)(addressPanel).getByRole("button", { name: /edit/i }));
        const streetInput = (0, react_1.within)(addressPanel).getByDisplayValue("456 Oak Avenue");
        const cityInput = (0, react_1.within)(addressPanel).getByDisplayValue("San Francisco");
        await user.clear(streetInput);
        await user.type(streetInput, "123 Main Street");
        await user.clear(cityInput);
        await user.type(cityInput, "Rochester");
        await user.click((0, react_1.within)(addressPanel).getByRole("button", { name: /save/i }));
        expect(react_1.screen.getByText("123 Main Street")).toBeInTheDocument();
        expect(react_1.screen.getByText("Rochester")).toBeInTheDocument();
        const saved = JSON.parse(localStorage.getItem("careconnect.profile"));
        expect(saved.address.street).toBe("123 Main Street");
        expect(saved.address.city).toBe("Rochester");
        expect(saved.personal.firstName).toBe("Robert");
    });
    test("saves Medical Information including textarea values", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        const medicalPanel = react_1.screen
            .getByText("Medical Information")
            .closest(".panel");
        await user.click((0, react_1.within)(medicalPanel).getByRole("button", { name: /edit/i }));
        const doctorInput = (0, react_1.within)(medicalPanel).getByDisplayValue("Dr. Sarah Mitchell");
        const textareas = (0, react_1.within)(medicalPanel).getAllByRole("textbox");
        const allergiesTextarea = textareas.find((el) => el.value.includes("Penicillin, Shellfish"));
        const conditionsTextarea = textareas.find((el) => el.value.includes("Parkinson’s Disease") &&
            el.value.includes("Hypertension") &&
            el.value.includes("Mild Osteoarthritis"));
        expect(allergiesTextarea).toBeDefined();
        expect(conditionsTextarea).toBeDefined();
        await user.clear(doctorInput);
        await user.type(doctorInput, "Dr. Jane Smith");
        await user.clear(allergiesTextarea);
        await user.type(allergiesTextarea, "Latex, Dust");
        await user.clear(conditionsTextarea);
        await user.type(conditionsTextarea, "Hypertension\nArthritis");
        await user.click((0, react_1.within)(medicalPanel).getByRole("button", { name: /save/i }));
        expect(react_1.screen.getByText("Dr. Jane Smith")).toBeInTheDocument();
        expect(react_1.screen.getByText("Latex, Dust")).toBeInTheDocument();
        const medicalConditionsLabel = (0, react_1.within)(medicalPanel).getByText("Medical Conditions");
        const medicalConditionsField = medicalConditionsLabel.closest(".field");
        const readonlyBlocks = medicalConditionsField.querySelectorAll(".readonly");
        expect(readonlyBlocks.length).toBeGreaterThan(0);
        const medicalConditionsValue = readonlyBlocks[0];
        expect(medicalConditionsValue.textContent?.replace(/\s+/g, " ").trim()).toBe("Hypertension Arthritis");
        const saved = JSON.parse(localStorage.getItem("careconnect.profile"));
        expect(saved.medical.primaryDoctor).toBe("Dr. Jane Smith");
        expect(saved.medical.allergies).toBe("Latex, Dust");
        expect(saved.medical.medicalConditions).toBe("Hypertension\nArthritis");
    });
    test("loads profile from localStorage on first render", () => {
        localStorage.setItem("careconnect.profile", JSON.stringify({
            personal: {
                firstName: "Alice",
                lastName: "Walker",
                dob: "01/02/1960",
                phone: "(111) 222-3333",
                email: "alice.walker@email.com",
            },
            address: {
                street: "789 Pine Street",
                city: "Seattle",
                state: "WA",
                zip: "98101",
            },
            medical: {
                primaryDoctor: "Dr. House",
                doctorPhone: "(222) 333-4444",
                preferredHospital: "Seattle General",
                bloodType: "A-",
                insuranceProvider: "Aetna",
                insuranceId: "AET123",
                allergies: "None",
                currentMedications: "Vitamin D",
                medicalConditions: "Diabetes",
            },
        }));
        renderScreen();
        expect(react_1.screen.getByText("Alice")).toBeInTheDocument();
        expect(react_1.screen.getByText("Walker")).toBeInTheDocument();
        expect(react_1.screen.getByText("789 Pine Street")).toBeInTheDocument();
        expect(react_1.screen.getByText("Seattle")).toBeInTheDocument();
        expect(react_1.screen.getByText("Dr. House")).toBeInTheDocument();
        expect(react_1.screen.getByText("Aetna")).toBeInTheDocument();
    });
    test("uses default profile when localStorage contains invalid JSON", () => {
        localStorage.setItem("careconnect.profile", "{bad json");
        renderScreen();
        expect(react_1.screen.getByText("Robert")).toBeInTheDocument();
        expect(react_1.screen.getByText("Johnson")).toBeInTheDocument();
        expect(react_1.screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
    });
    test("calls navigate on logout and calls careconnect.quitApp on quit", async () => {
        const user = user_event_1.default.setup();
        renderScreen();
        await user.click(react_1.screen.getByRole("button", { name: "Mock Logout" }));
        expect(mockNavigate).toHaveBeenCalledWith("/login");
        await user.click(react_1.screen.getByRole("button", { name: "Mock Quit" }));
        expect(mockQuitApp).toHaveBeenCalledTimes(1);
    });
});
