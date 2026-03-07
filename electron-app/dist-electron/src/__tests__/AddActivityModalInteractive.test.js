"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const AddActivityModal_1 = __importDefault(require("../screens/components/AddActivityModal"));
const mockAddActivity = jest.fn();
const mockOnClose = jest.fn();
jest.mock("../state/activitiesStore", () => ({
    __esModule: true,
    useActivities: () => ({
        addActivity: mockAddActivity,
    }),
}));
describe("AddActivityModal interactive test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("renders dialog content and focuses title input on open", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        expect(react_1.screen.getByRole("dialog")).toBeInTheDocument();
        expect(react_1.screen.getByText("Add New Activity")).toBeInTheDocument();
        expect(react_1.screen.getByText("Add a task or reminder to your daily schedule")).toBeInTheDocument();
        const titleInput = react_1.screen.getByLabelText("Activity Title");
        const timeInput = react_1.screen.getByLabelText("Time (optional)");
        expect(titleInput).toBeInTheDocument();
        expect(timeInput).toBeInTheDocument();
        expect(titleInput).toHaveFocus();
    });
    test("submit button starts disabled and becomes enabled when title is entered", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const addButton = react_1.screen.getByRole("button", { name: "Add Activity" });
        const titleInput = react_1.screen.getByLabelText("Activity Title");
        expect(addButton).toBeDisabled();
        expect(addButton).toHaveAttribute("aria-disabled", "true");
        await user.type(titleInput, "Take a walk");
        expect(addButton).toBeEnabled();
        expect(addButton).toHaveAttribute("aria-disabled", "false");
    });
    test("adds an activity with title only and closes modal", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        await user.type(react_1.screen.getByLabelText("Activity Title"), "Take a walk");
        await user.click(react_1.screen.getByRole("button", { name: "Add Activity" }));
        expect(mockAddActivity).toHaveBeenCalledWith("Take a walk", undefined);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("adds an activity with title and time and closes modal", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        await user.type(react_1.screen.getByLabelText("Activity Title"), "Doctor visit");
        await user.type(react_1.screen.getByLabelText("Time (optional)"), "3:00 PM");
        await user.click(react_1.screen.getByRole("button", { name: "Add Activity" }));
        expect(mockAddActivity).toHaveBeenCalledWith("Doctor visit", "3:00 PM");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("trims title and time before submit", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        await user.type(react_1.screen.getByLabelText("Activity Title"), "   Read book   ");
        await user.type(react_1.screen.getByLabelText("Time (optional)"), "   8:30 AM   ");
        await user.click(react_1.screen.getByRole("button", { name: "Add Activity" }));
        expect(mockAddActivity).toHaveBeenCalledWith("Read book", "8:30 AM");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("close button closes the modal", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        await user.click(react_1.screen.getByRole("button", { name: "Close dialog" }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking the overlay closes the modal", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const overlay = react_1.screen.getByRole("presentation");
        react_1.fireEvent.mouseDown(overlay, { target: overlay, currentTarget: overlay });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking inside the modal does not close it", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const overlay = react_1.screen.getByRole("presentation");
        const dialog = react_1.screen.getByRole("dialog");
        react_1.fireEvent.mouseDown(overlay, { target: dialog, currentTarget: overlay });
        expect(mockOnClose).not.toHaveBeenCalled();
    });
    test("Escape closes the modal", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        await user.keyboard("{Escape}");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("Tab focus trap cycles from last enabled focusable back to first", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const timeInput = react_1.screen.getByLabelText("Time (optional)");
        const closeButton = react_1.screen.getByRole("button", { name: "Close dialog" });
        timeInput.focus();
        expect(timeInput).toHaveFocus();
        await user.keyboard("{Tab}");
        expect(closeButton).toHaveFocus();
    });
    test("Shift+Tab focus trap cycles from first focusable to last enabled focusable", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const closeButton = react_1.screen.getByRole("button", { name: "Close dialog" });
        const timeInput = react_1.screen.getByLabelText("Time (optional)");
        closeButton.focus();
        expect(closeButton).toHaveFocus();
        await user.keyboard("{Shift>}{Tab}{/Shift}");
        expect(timeInput).toHaveFocus();
    });
    test("Shift+Tab and Tab include Add Activity once it becomes enabled", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const titleInput = react_1.screen.getByLabelText("Activity Title");
        const closeButton = react_1.screen.getByRole("button", { name: "Close dialog" });
        const addButton = react_1.screen.getByRole("button", { name: "Add Activity" });
        await user.type(titleInput, "Walk");
        expect(addButton).toBeEnabled();
        closeButton.focus();
        expect(closeButton).toHaveFocus();
        await user.keyboard("{Shift>}{Tab}{/Shift}");
        expect(addButton).toHaveFocus();
        await user.keyboard("{Tab}");
        expect(closeButton).toHaveFocus();
    });
    test("clears visible error when user types again", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(AddActivityModal_1.default, { onClose: mockOnClose }));
        const titleInput = react_1.screen.getByLabelText("Activity Title");
        await user.type(titleInput, "Walk");
        await user.clear(titleInput);
        expect(react_1.screen.getByRole("button", { name: "Add Activity" })).toBeDisabled();
        await user.type(titleInput, "W");
        expect(react_1.screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
