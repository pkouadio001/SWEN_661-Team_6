import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ExerciseInstructionsModal from "../screens/components/ExerciseInstructionsModal";

const mockOnClose = jest.fn();
const mockOnStart = jest.fn();

const sampleExercise = {
  id: "exercise-1",
  title: "Morning Stretch",
  description: "A simple stretching routine",
  durationMin: 15,
  difficulty: "Easy" as const,
  overview:
    "This gentle stretching routine helps improve flexibility and reduce stiffness.",
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
    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Morning Stretch")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Follow these instructions carefully to perform the exercise safely and effectively."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("🕒 15 min")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This gentle stretching routine helps improve flexibility and reduce stiffness."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Step-by-Step Instructions")).toBeInTheDocument();
    expect(
      screen.getByText("Stand upright with feet shoulder-width apart.")
    ).toBeInTheDocument();
    expect(screen.getByText("Raise both arms slowly overhead.")).toBeInTheDocument();
    expect(
      screen.getByText("Bend gently to each side for 10 seconds.")
    ).toBeInTheDocument();

    expect(screen.getByText("⚠ Safety Reminders")).toBeInTheDocument();
    expect(
      screen.getByText("Move slowly and avoid jerking motions.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Stop immediately if you feel pain.")
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    expect(closeButtons).toHaveLength(2);

    expect(
      screen.getByRole("button", { name: /start exercise/i })
    ).toBeInTheDocument();
  });

  test("renders all step numbers in order", () => {
    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    const stepsList = document.querySelector(".stepsList");
    expect(stepsList).toBeTruthy();

    const stepItems = within(stepsList as HTMLElement).getAllByRole("listitem");
    expect(stepItems).toHaveLength(3);

    expect(within(stepItems[0]).getByText("1")).toBeInTheDocument();
    expect(within(stepItems[1]).getByText("2")).toBeInTheDocument();
    expect(within(stepItems[2]).getByText("3")).toBeInTheDocument();
  });

  test("start exercise button calls onStart with the exercise id", async () => {
    const user = userEvent.setup();

    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    await user.click(screen.getByRole("button", { name: /start exercise/i }));

    expect(mockOnStart).toHaveBeenCalledTimes(1);
    expect(mockOnStart).toHaveBeenCalledWith("exercise-1");
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("header close button calls onClose", async () => {
    const user = userEvent.setup();

    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    expect(closeButtons).toHaveLength(2);

    await user.click(closeButtons[0]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("footer Close button calls onClose", async () => {
    const user = userEvent.setup();

    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    expect(closeButtons).toHaveLength(2);

    await user.click(closeButtons[1]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking overlay closes the modal", () => {
    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    const overlay = screen.getByRole("dialog");
    fireEvent.mouseDown(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside modal content does not close the modal", () => {
    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    const modalContent = document.querySelector(".exerciseModal");
    expect(modalContent).toBeTruthy();

    fireEvent.mouseDown(modalContent as Element);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("Escape key closes the modal", async () => {
    const user = userEvent.setup();

    render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("removes Escape listener on unmount", () => {
    const { unmount } = render(
      <ExerciseInstructionsModal
        exercise={sampleExercise}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    unmount();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("renders different difficulty styling text correctly", () => {
    render(
      <ExerciseInstructionsModal
        exercise={{
          ...sampleExercise,
          id: "exercise-2",
          title: "Strength Builder",
          difficulty: "Moderate",
          durationMin: 25,
        }}
        onClose={mockOnClose}
        onStart={mockOnStart}
      />
    );

    expect(screen.getByText("Strength Builder")).toBeInTheDocument();
    expect(screen.getByText("🕒 25 min")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });
});