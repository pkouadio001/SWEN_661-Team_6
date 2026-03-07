"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const ExerciseInstructionsModal_1 = __importDefault(require("../screens/components/ExerciseInstructionsModal"));
const mockOnClose = jest.fn();
const mockOnStart = jest.fn();
const sampleExercise = {
    id: "exercise-1",
    title: "Morning Stretch",
    description: "A simple stretching routine",
    durationMin: 15,
    difficulty: "Easy",
    overview: "This gentle stretching routine helps improve flexibility and reduce stiffness.",
    steps: [
        "Stand upright with feet shoulder-width apart.",
        "Raise both arms slowly overhead.",
        "Bend gently to each side for 10 seconds.",
    ],
    safety: [
        "Move slowly and avoid jerking motions.",
        "Stop immediately if you feel pain.",
    ],
};
describe("ExerciseInstructionsModal interactive test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("renders modal content, metadata, steps, and safety reminders", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        expect(react_1.screen.getByRole("dialog")).toBeInTheDocument();
        expect(react_1.screen.getByText("Morning Stretch")).toBeInTheDocument();
        expect(react_1.screen.getByText("Follow these instructions carefully to perform the exercise safely and effectively.")).toBeInTheDocument();
        expect(react_1.screen.getByText("🕒 15 min")).toBeInTheDocument();
        expect(react_1.screen.getByText("Easy")).toBeInTheDocument();
        expect(react_1.screen.getByText("Overview")).toBeInTheDocument();
        expect(react_1.screen.getByText("This gentle stretching routine helps improve flexibility and reduce stiffness.")).toBeInTheDocument();
        expect(react_1.screen.getByText("Step-by-Step Instructions")).toBeInTheDocument();
        expect(react_1.screen.getByText("Stand upright with feet shoulder-width apart.")).toBeInTheDocument();
        expect(react_1.screen.getByText("Raise both arms slowly overhead.")).toBeInTheDocument();
        expect(react_1.screen.getByText("Bend gently to each side for 10 seconds.")).toBeInTheDocument();
        expect(react_1.screen.getByText("⚠ Safety Reminders")).toBeInTheDocument();
        expect(react_1.screen.getByText("Move slowly and avoid jerking motions.")).toBeInTheDocument();
        expect(react_1.screen.getByText("Stop immediately if you feel pain.")).toBeInTheDocument();
        const closeButtons = react_1.screen.getAllByRole("button", { name: "Close" });
        expect(closeButtons).toHaveLength(2);
        expect(react_1.screen.getByRole("button", { name: /start exercise/i })).toBeInTheDocument();
    });
    test("renders all step numbers in order", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        const stepsList = document.querySelector(".stepsList");
        expect(stepsList).toBeTruthy();
        const stepItems = (0, react_1.within)(stepsList).getAllByRole("listitem");
        expect(stepItems).toHaveLength(3);
        expect((0, react_1.within)(stepItems[0]).getByText("1")).toBeInTheDocument();
        expect((0, react_1.within)(stepItems[1]).getByText("2")).toBeInTheDocument();
        expect((0, react_1.within)(stepItems[2]).getByText("3")).toBeInTheDocument();
    });
    test("start exercise button calls onStart with the exercise id", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        await user.click(react_1.screen.getByRole("button", { name: /start exercise/i }));
        expect(mockOnStart).toHaveBeenCalledTimes(1);
        expect(mockOnStart).toHaveBeenCalledWith("exercise-1");
        expect(mockOnClose).not.toHaveBeenCalled();
    });
    test("header close button calls onClose", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        const closeButtons = react_1.screen.getAllByRole("button", { name: "Close" });
        expect(closeButtons).toHaveLength(2);
        await user.click(closeButtons[0]);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("footer Close button calls onClose", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        const closeButtons = react_1.screen.getAllByRole("button", { name: "Close" });
        expect(closeButtons).toHaveLength(2);
        await user.click(closeButtons[1]);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking overlay closes the modal", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        const overlay = react_1.screen.getByRole("dialog");
        react_1.fireEvent.mouseDown(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking inside modal content does not close the modal", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        const modalContent = document.querySelector(".exerciseModal");
        expect(modalContent).toBeTruthy();
        react_1.fireEvent.mouseDown(modalContent);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
    test("Escape key closes the modal", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        await user.keyboard("{Escape}");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("removes Escape listener on unmount", () => {
        const { unmount } = (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: sampleExercise, onClose: mockOnClose, onStart: mockOnStart }));
        unmount();
        react_1.fireEvent.keyDown(window, { key: "Escape" });
        expect(mockOnClose).not.toHaveBeenCalled();
    });
    test("renders different difficulty styling text correctly", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ExerciseInstructionsModal_1.default, { exercise: {
                ...sampleExercise,
                id: "exercise-2",
                title: "Strength Builder",
                difficulty: "Moderate",
                durationMin: 25,
            }, onClose: mockOnClose, onStart: mockOnStart }));
        expect(react_1.screen.getByText("Strength Builder")).toBeInTheDocument();
        expect(react_1.screen.getByText("🕒 25 min")).toBeInTheDocument();
        expect(react_1.screen.getByText("Moderate")).toBeInTheDocument();
    });
});
