import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddMedicationModal from "../screens/components/AddMedicationModal";

const mockOnClose = jest.fn();
const mockOnAdd = jest.fn();

describe("AddMedicationModal interactive test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal content and input fields", () => {
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    expect(screen.getByText("Add New Medication")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your medication details below")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("e.g., Carbidopa-Levodopa")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., 25-100mg")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., Take with food")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add Medication" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("shows validation error when medication name is missing", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(screen.getByText("Medication name is required.")).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test("shows validation error when dosage is missing", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.type(
      screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"),
      "Carbidopa-Levodopa"
    );
    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(screen.getByText("Dosage is required.")).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test("shows validation error when times are missing", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.type(
      screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"),
      "Carbidopa-Levodopa"
    );
    await user.type(screen.getByPlaceholderText("e.g., 25-100mg"), "25-100mg");
    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(
      screen.getByText("At least one time is required (comma separated).")
    ).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test("adds medication when all required fields are provided", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.type(
      screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"),
      "Carbidopa-Levodopa"
    );
    await user.type(screen.getByPlaceholderText("e.g., 25-100mg"), "25-100mg");
    await user.type(
      screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"),
      "8:00 AM, 2:00 PM"
    );
    await user.type(screen.getByPlaceholderText("e.g., Take with food"), "Take with food");

    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith({
      name: "Carbidopa-Levodopa",
      dosage: "25-100mg",
      times: "8:00 AM, 2:00 PM",
      notes: "Take with food",
    });
  });

  test("passes undefined notes when notes field is blank after trimming", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.type(screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Aspirin");
    await user.type(screen.getByPlaceholderText("e.g., 25-100mg"), "100mg");
    await user.type(screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"), "9:00 AM");
    await user.type(screen.getByPlaceholderText("e.g., Take with food"), "   ");

    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(mockOnAdd).toHaveBeenCalledWith({
      name: "Aspirin",
      dosage: "100mg",
      times: "9:00 AM",
      notes: undefined,
    });
  });

  test("clears previous error after successful submission attempt", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.click(screen.getByRole("button", { name: "Add Medication" }));
    expect(screen.getByText("Medication name is required.")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("e.g., Carbidopa-Levodopa"), "Metformin");
    await user.type(screen.getByPlaceholderText("e.g., 25-100mg"), "500mg");
    await user.type(screen.getByPlaceholderText("e.g., 8:00 AM, 2:00 PM"), "7:00 AM");

    await user.click(screen.getByRole("button", { name: "Add Medication" }));

    expect(screen.queryByText("Medication name is required.")).not.toBeInTheDocument();
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  test("close button calls onClose", async () => {
    const user = userEvent.setup();
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking modal overlay calls onClose", () => {
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    const overlay = document.querySelector(".modalOverlay");
    expect(overlay).toBeTruthy();

    fireEvent.mouseDown(overlay as Element);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside modal does not call onClose", () => {
    render(<AddMedicationModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    const modal = document.querySelector(".addMedModal");
    expect(modal).toBeTruthy();

    fireEvent.mouseDown(modal as Element);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});