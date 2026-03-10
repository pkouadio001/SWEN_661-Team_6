import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import Router from "../app/router";

jest.mock("../screens/LoginScreen", () => ({
  __esModule: true,
  default: () => <div>Login Screen</div>,
}));

jest.mock("../screens/DashboardScreen", () => ({
  __esModule: true,
  default: () => <div>Dashboard Screen</div>,
}));

jest.mock("../screens/MyHealthScreen", () => ({
  __esModule: true,
  default: () => {
    const [checked, setChecked] = useState(false);
    const [customChecked, setCustomChecked] = useState(false);

    return (
      <div>
        <label>
          My Health Screen
          <input
            aria-label="test-check"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
          />
        </label>

        <div
          aria-checked={customChecked}
          aria-label="custom-check"
          role="checkbox"
          tabIndex={0}
          onClick={() => setCustomChecked((prev) => !prev)}
        >
          Custom Checkbox
        </div>
      </div>
    );
  },
}));

jest.mock("../screens/MedicationsScreen", () => ({
  __esModule: true,
  default: () => <div>Medications Screen</div>,
}));

jest.mock("../screens/SizeDemoScreen", () => ({
  __esModule: true,
  default: () => <div>Size Demo Screen</div>,
}));

jest.mock("../screens/ExercisesScreen", () => ({
  __esModule: true,
  default: () => <div>Exercises Screen</div>,
}));

jest.mock("../screens/MyInfoScreen", () => ({
  __esModule: true,
  default: () => <div>My Info Screen</div>,
}));

jest.mock("../screens/SymptomsScreen", () => ({
  __esModule: true,
  default: () => <div>Symptoms Screen</div>,
}));

jest.mock("../screens/EmergencyScreen", () => ({
  __esModule: true,
  default: () => <div>Emergency Screen</div>,
}));

jest.mock("../screens/ActivitiesScreen", () => ({
  __esModule: true,
  default: () => <div>Activities Screen</div>,
}));

describe("Router Escape Navigation", () => {
  beforeEach(() => {
    localStorage.setItem("careconnect.authenticated", "true");
  });

  test("Escape navigates to dashboard from app routes", () => {
    render(
      <MemoryRouter initialEntries={["/my-health"]}>
        <Router />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Health Screen")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByText("Dashboard Screen")).toBeInTheDocument();
  });

  test("Escape does not navigate away from login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Router />
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Screen")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
  });

  test("Escape does not go to dashboard when unauthenticated", () => {
    localStorage.setItem("careconnect.authenticated", "false");

    render(
      <MemoryRouter initialEntries={["/my-health"]}>
        <Router />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Health Screen")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
  });

  test("Enter toggles focused checkbox", () => {
    render(
      <MemoryRouter initialEntries={["/my-health"]}>
        <Router />
      </MemoryRouter>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "test-check" }) as HTMLInputElement;
    checkbox.focus();
    expect(checkbox.checked).toBe(false);

    fireEvent.keyDown(document, { key: "Enter" });

    expect(checkbox.checked).toBe(true);
  });

  test("Enter toggles focused custom role checkbox", () => {
    render(
      <MemoryRouter initialEntries={["/my-health"]}>
        <Router />
      </MemoryRouter>,
    );

    const customCheckbox = screen.getByRole("checkbox", {
      name: "custom-check",
    });
    customCheckbox.focus();
    expect(customCheckbox).toHaveAttribute("aria-checked", "false");

    fireEvent.keyDown(document, { key: "Enter" });

    expect(customCheckbox).toHaveAttribute("aria-checked", "true");
  });
});
