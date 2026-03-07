"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const AddMedicationModal_1 = __importDefault(require("../screens/components/AddMedicationModal"));
const mockOnClose = jest.fn();
const mockOnAdd = jest.fn();
describe("AddMedicationModal interactive test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("renders modal content and input fields", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        expect(react_1.screen.getByText("Add New Medication")).toBeInTheDocument();
        expect(react_1.screen.getByText("Enter your medication details below")).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa")).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText("e.g., 25-100mg")).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM")).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText("e.g., Take with food")).toBeInTheDocument();
        expect(react_1.screen.getByRole("button", { name: "Add Medication" })).toBeInTheDocument();
        expect(react_1.screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
    test("shows validation error when medication name is missing", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(react_1.screen.getByText("Medication name is required.")).toBeInTheDocument();
        expect(mockOnAdd).not.toHaveBeenCalled();
    });
    test("shows validation error when dosage is missing", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.type(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Carbidopa-Levodopa");
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(react_1.screen.getByText("Dosage is required.")).toBeInTheDocument();
        expect(mockOnAdd).not.toHaveBeenCalled();
    });
    test("shows validation error when times are missing", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.type(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Carbidopa-Levodopa");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 25-100mg"), "25-100mg");
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(react_1.screen.getByText("At least one time is required (comma separated).")).toBeInTheDocument();
        expect(mockOnAdd).not.toHaveBeenCalled();
    });
    test("adds medication when all required fields are provided", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.type(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Carbidopa-Levodopa");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 25-100mg"), "25-100mg");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"), "8:00 AM, 2:00 PM");
        await user.type(react_1.screen.getByPlaceholderText("e.g., Take with food"), "Take with food");
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
        expect(mockOnAdd).toHaveBeenCalledWith({
            name: "Carbidopa-Levodopa",
            dosage: "25-100mg",
            times: "8:00 AM, 2:00 PM",
            notes: "Take with food",
        });
    });
    test("passes undefined notes when notes field is blank after trimming", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.type(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Aspirin");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 25-100mg"), "100mg");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"), "9:00 AM");
        await user.type(react_1.screen.getByPlaceholderText("e.g., Take with food"), "   ");
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(mockOnAdd).toHaveBeenCalledWith({
            name: "Aspirin",
            dosage: "100mg",
            times: "9:00 AM",
            notes: undefined,
        });
    });
    test("clears previous error after successful submission attempt", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(react_1.screen.getByText("Medication name is required.")).toBeInTheDocument();
        await user.type(react_1.screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Metformin");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 25-100mg"), "500mg");
        await user.type(react_1.screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"), "7:00 AM");
        await user.click(react_1.screen.getByRole("button", { name: "Add Medication" }));
        expect(react_1.screen.queryByText("Medication name is required.")).not.toBeInTheDocument();
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
    test("close button calls onClose", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        await user.click(react_1.screen.getByRole("button", { name: "Close" }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking modal overlay calls onClose", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        const overlay = document.querySelector(".modalOverlay");
        expect(overlay).toBeTruthy();
        react_1.fireEvent.mouseDown(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking inside modal does not call onClose", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddMedicationModal_1.default, { onClose: mockOnClose, onAdd: mockOnAdd }));
        const modal = document.querySelector(".addMedModal");
        expect(modal).toBeTruthy();
        react_1.fireEvent.mouseDown(modal);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
