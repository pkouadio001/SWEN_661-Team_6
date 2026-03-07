"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const TextSizeModal_1 = __importDefault(require("../screens/components/TextSizeModal"));
const mockSetScale = jest.fn();
let mockScale = "medium";
jest.mock("../state/uiScale", () => ({
    __esModule: true,
    useUiScale: () => ({
        scale: mockScale,
        setScale: mockSetScale,
    }),
}));
describe("TextSizeModal interactive test", () => {
    const mockOnClose = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        mockScale = "medium";
    });
    test("renders modal title, options, and hint text", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        expect(react_1.screen.getByText("Adjust All Interface Elements")).toBeInTheDocument();
        expect(react_1.screen.getByText("Small (90% page scale)")).toBeInTheDocument();
        expect(react_1.screen.getByText("Medium (100% - Default)")).toBeInTheDocument();
        expect(react_1.screen.getByText("Large (110% page scale)")).toBeInTheDocument();
        expect(react_1.screen.getByText("Compact text, buttons, and page")).toBeInTheDocument();
        expect(react_1.screen.getByText("Balanced text, buttons, and page")).toBeInTheDocument();
        expect(react_1.screen.getByText("Large text, buttons, and page")).toBeInTheDocument();
        const hint = document.querySelector(".sizeModalHint");
        expect(hint).toBeInTheDocument();
        expect(hint.textContent?.replace(/\s+/g, " ").trim()).toBe("Tip: You can also change this from the Size Demo screen.");
        expect((0, react_1.within)(hint).getByText("Size Demo")).toBeInTheDocument();
        expect(react_1.screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
    test("shows checkmark on the active scale option", () => {
        mockScale = "medium";
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        const activeOption = react_1.screen.getByRole("button", {
            name: /medium \(100% - default\)/i,
        });
        expect(activeOption).toHaveClass("active");
        expect(react_1.screen.getByText("✓")).toBeInTheDocument();
    });
    test("renders small as active when scale is small", () => {
        mockScale = "small";
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        const activeOption = react_1.screen.getByRole("button", {
            name: /small \(90% page scale\)/i,
        });
        expect(activeOption).toHaveClass("active");
        expect(react_1.screen.getByText("✓")).toBeInTheDocument();
    });
    test("renders large as active when scale is large", () => {
        mockScale = "large";
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        const activeOption = react_1.screen.getByRole("button", {
            name: /large \(110% page scale\)/i,
        });
        expect(activeOption).toHaveClass("active");
        expect(react_1.screen.getByText("✓")).toBeInTheDocument();
    });
    test("clicking small option calls setScale with small", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        await user.click(react_1.screen.getByRole("button", { name: /small \(90% page scale\)/i }));
        expect(mockSetScale).toHaveBeenCalledTimes(1);
        expect(mockSetScale).toHaveBeenCalledWith("small");
    });
    test("clicking medium option calls setScale with medium", async () => {
        const user = user_event_1.default.setup();
        mockScale = "small";
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        await user.click(react_1.screen.getByRole("button", { name: /medium \(100% - default\)/i }));
        expect(mockSetScale).toHaveBeenCalledTimes(1);
        expect(mockSetScale).toHaveBeenCalledWith("medium");
    });
    test("clicking large option calls setScale with large", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        await user.click(react_1.screen.getByRole("button", { name: /large \(110% page scale\)/i }));
        expect(mockSetScale).toHaveBeenCalledTimes(1);
        expect(mockSetScale).toHaveBeenCalledWith("large");
    });
    test("close button calls onClose", async () => {
        const user = user_event_1.default.setup();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        await user.click(react_1.screen.getByRole("button", { name: "Close" }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking modal overlay calls onClose", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        const overlay = document.querySelector(".modalOverlay");
        expect(overlay).toBeTruthy();
        react_1.fireEvent.mouseDown(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    test("clicking inside modal does not call onClose", () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(TextSizeModal_1.default, { onClose: mockOnClose }));
        const modal = document.querySelector(".sizeModal");
        expect(modal).toBeTruthy();
        react_1.fireEvent.mouseDown(modal);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
