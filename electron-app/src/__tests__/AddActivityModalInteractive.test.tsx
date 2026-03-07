import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddActivityModal from "../screens/components/AddActivityModal";

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
    render(<AddActivityModal onClose={mockOnClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Activity")).toBeInTheDocument();
    expect(
      screen.getByText("Add a task or reminder to your daily schedule")
    ).toBeInTheDocument();

    const titleInput = screen.getByLabelText("Activity Title");
    const timeInput = screen.getByLabelText("Time (optional)");

    expect(titleInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();
    expect(titleInput).toHaveFocus();
  });

  test("submit button starts disabled and becomes enabled when title is entered", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    const addButton = screen.getByRole("button", { name: "Add Activity" });
    const titleInput = screen.getByLabelText("Activity Title");

    expect(addButton).toBeDisabled();
    expect(addButton).toHaveAttribute("aria-disabled", "true");

    await user.type(titleInput, "Take a walk");

    expect(addButton).toBeEnabled();
    expect(addButton).toHaveAttribute("aria-disabled", "false");
  });

  test("adds an activity with title only and closes modal", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    await user.type(screen.getByLabelText("Activity Title"), "Take a walk");
    await user.click(screen.getByRole("button", { name: "Add Activity" }));

    expect(mockAddActivity).toHaveBeenCalledWith("Take a walk", undefined);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("adds an activity with title and time and closes modal", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    await user.type(screen.getByLabelText("Activity Title"), "Doctor visit");
    await user.type(screen.getByLabelText("Time (optional)"), "3:00 PM");
    await user.click(screen.getByRole("button", { name: "Add Activity" }));

    expect(mockAddActivity).toHaveBeenCalledWith("Doctor visit", "3:00 PM");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("trims title and time before submit", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    await user.type(screen.getByLabelText("Activity Title"), "   Read book   ");
    await user.type(screen.getByLabelText("Time (optional)"), "   8:30 AM   ");
    await user.click(screen.getByRole("button", { name: "Add Activity" }));

    expect(mockAddActivity).toHaveBeenCalledWith("Read book", "8:30 AM");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("close button closes the modal", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking the overlay closes the modal", () => {
    render(<AddActivityModal onClose={mockOnClose} />);

    const overlay = screen.getByRole("presentation");
    fireEvent.mouseDown(overlay, { target: overlay, currentTarget: overlay });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the modal does not close it", () => {
    render(<AddActivityModal onClose={mockOnClose} />);

    const overlay = screen.getByRole("presentation");
    const dialog = screen.getByRole("dialog");

    fireEvent.mouseDown(overlay, { target: dialog, currentTarget: overlay });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("Escape closes the modal", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("Tab focus trap cycles from last enabled focusable back to first", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    const timeInput = screen.getByLabelText("Time (optional)");
    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    timeInput.focus();
    expect(timeInput).toHaveFocus();

    await user.keyboard("{Tab}");

    expect(closeButton).toHaveFocus();
  });

  test("Shift+Tab focus trap cycles from first focusable to last enabled focusable", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    const timeInput = screen.getByLabelText("Time (optional)");

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");

    expect(timeInput).toHaveFocus();
  });

  test("Shift+Tab and Tab include Add Activity once it becomes enabled", async () => {
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Activity Title");
    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    const addButton = screen.getByRole("button", { name: "Add Activity" });

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
    const user = userEvent.setup();
    render(<AddActivityModal onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Activity Title");

    await user.type(titleInput, "Walk");
    await user.clear(titleInput);

    expect(screen.getByRole("button", { name: "Add Activity" })).toBeDisabled();

    await user.type(titleInput, "W");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});