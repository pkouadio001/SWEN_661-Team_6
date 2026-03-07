import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TextSizeModal from "../screens/components/TextSizeModal";

const mockSetScale = jest.fn();

let mockScale: "small" | "medium" | "large" = "medium";

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
    render(<TextSizeModal onClose={mockOnClose} />);

    expect(screen.getByText("Adjust All Interface Elements")).toBeInTheDocument();

    expect(screen.getByText("Small (90% page scale)")).toBeInTheDocument();
    expect(screen.getByText("Medium (100% - Default)")).toBeInTheDocument();
    expect(screen.getByText("Large (110% page scale)")).toBeInTheDocument();

    expect(
      screen.getByText("Compact text, buttons, and page")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Balanced text, buttons, and page")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Large text, buttons, and page")
    ).toBeInTheDocument();

    const hint = document.querySelector(".sizeModalHint") as HTMLElement;
    expect(hint).toBeInTheDocument();
    expect(hint.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Tip: You can also change this from the Size Demo screen."
    );
    expect(within(hint).getByText("Size Demo")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("shows checkmark on the active scale option", () => {
    mockScale = "medium";
    render(<TextSizeModal onClose={mockOnClose} />);

    const activeOption = screen.getByRole("button", {
      name: /medium \(100% - default\)/i,
    });

    expect(activeOption).toHaveClass("active");
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  test("renders small as active when scale is small", () => {
    mockScale = "small";
    render(<TextSizeModal onClose={mockOnClose} />);

    const activeOption = screen.getByRole("button", {
      name: /small \(90% page scale\)/i,
    });

    expect(activeOption).toHaveClass("active");
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  test("renders large as active when scale is large", () => {
    mockScale = "large";
    render(<TextSizeModal onClose={mockOnClose} />);

    const activeOption = screen.getByRole("button", {
      name: /large \(110% page scale\)/i,
    });

    expect(activeOption).toHaveClass("active");
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  test("clicking small option calls setScale with small", async () => {
    const user = userEvent.setup();
    render(<TextSizeModal onClose={mockOnClose} />);

    await user.click(
      screen.getByRole("button", { name: /small \(90% page scale\)/i })
    );

    expect(mockSetScale).toHaveBeenCalledTimes(1);
    expect(mockSetScale).toHaveBeenCalledWith("small");
  });

  test("clicking medium option calls setScale with medium", async () => {
    const user = userEvent.setup();
    mockScale = "small";
    render(<TextSizeModal onClose={mockOnClose} />);

    await user.click(
      screen.getByRole("button", { name: /medium \(100% - default\)/i })
    );

    expect(mockSetScale).toHaveBeenCalledTimes(1);
    expect(mockSetScale).toHaveBeenCalledWith("medium");
  });

  test("clicking large option calls setScale with large", async () => {
    const user = userEvent.setup();
    render(<TextSizeModal onClose={mockOnClose} />);

    await user.click(
      screen.getByRole("button", { name: /large \(110% page scale\)/i })
    );

    expect(mockSetScale).toHaveBeenCalledTimes(1);
    expect(mockSetScale).toHaveBeenCalledWith("large");
  });

  test("close button calls onClose", async () => {
    const user = userEvent.setup();
    render(<TextSizeModal onClose={mockOnClose} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking modal overlay calls onClose", () => {
    render(<TextSizeModal onClose={mockOnClose} />);

    const overlay = document.querySelector(".modalOverlay");
    expect(overlay).toBeTruthy();

    fireEvent.mouseDown(overlay as Element);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside modal does not call onClose", () => {
    render(<TextSizeModal onClose={mockOnClose} />);

    const modal = document.querySelector(".sizeModal");
    expect(modal).toBeTruthy();

    fireEvent.mouseDown(modal as Element);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});