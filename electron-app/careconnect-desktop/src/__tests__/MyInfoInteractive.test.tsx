import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MyInfoScreen from "../screens/MyInfoScreen";

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
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock("../components/TopBar", () => ({
  __esModule: true,
  default: ({
    onLogout,
    onQuit,
  }: {
    onLogout?: () => void;
    onQuit?: () => void;
  }) => (
    <div data-testid="topbar">
      <button onClick={onLogout}>Mock Logout</button>
      <button onClick={onQuit}>Mock Quit</button>
    </div>
  ),
}));

function renderScreen() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MyInfoScreen />
    </MemoryRouter>
  );
}

describe("MyInfoScreen interactive test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (window as any).careconnect = {
      quitApp: mockQuitApp,
    };
  });

  test("renders the shell, title, and default profile data", () => {
    renderScreen();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("topbar")).toBeInTheDocument();

    expect(screen.getByText("User Information")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your personal and medical information")
    ).toBeInTheDocument();

    expect(screen.getByText("Robert")).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
    expect(screen.getByText("04/15/1955")).toBeInTheDocument();
    expect(screen.getByText("(555) 234-5678")).toBeInTheDocument();
    expect(screen.getByText("robert.johnson@email.com")).toBeInTheDocument();

    expect(screen.getByText("456 Oak Avenue")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("CA")).toBeInTheDocument();
    expect(screen.getByText("94105")).toBeInTheDocument();

    expect(screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
    expect(screen.getByText("Blue Cross Blue Shield")).toBeInTheDocument();
  });

  test("enters edit mode for Personal Information, saves changes, and persists to localStorage", async () => {
    const user = userEvent.setup();
    renderScreen();

    const personalSectionTitle = screen.getByText("Personal Information");
    const personalPanel = personalSectionTitle.closest(".panel") as HTMLElement;

    expect(personalPanel).toBeInTheDocument();

    const editButton = within(personalPanel).getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const firstNameInput = within(personalPanel).getByDisplayValue("Robert");
    const lastNameInput = within(personalPanel).getByDisplayValue("Johnson");
    const emailInput = within(personalPanel).getByDisplayValue("robert.johnson@email.com");

    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Bernabe");

    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Garcia");

    await user.clear(emailInput);
    await user.type(emailInput, "bernabe.garcia@email.com");

    const saveButton = within(personalPanel).getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(screen.getByText("Bernabe")).toBeInTheDocument();
    expect(screen.getByText("Garcia")).toBeInTheDocument();
    expect(screen.getByText("bernabe.garcia@email.com")).toBeInTheDocument();

    const savedRaw = localStorage.getItem("careconnect.profile");
    expect(savedRaw).toBeTruthy();

    const saved = JSON.parse(savedRaw as string);
    expect(saved.personal.firstName).toBe("Bernabe");
    expect(saved.personal.lastName).toBe("Garcia");
    expect(saved.personal.email).toBe("bernabe.garcia@email.com");
  });

  test("cancels Personal Information edits and restores original values", async () => {
    const user = userEvent.setup();
    renderScreen();

    const personalPanel = screen
      .getByText("Personal Information")
      .closest(".panel") as HTMLElement;

    await user.click(within(personalPanel).getByRole("button", { name: /edit/i }));

    const firstNameInput = within(personalPanel).getByDisplayValue("Robert");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "ChangedName");

    await user.click(within(personalPanel).getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Robert")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("ChangedName")).not.toBeInTheDocument();
    expect(localStorage.getItem("careconnect.profile")).toBeNull();
  });

  test("saves Address section changes independently", async () => {
    const user = userEvent.setup();
    renderScreen();

    const addressPanel = screen.getByText("Home Address").closest(".panel") as HTMLElement;

    await user.click(within(addressPanel).getByRole("button", { name: /edit/i }));

    const streetInput = within(addressPanel).getByDisplayValue("456 Oak Avenue");
    const cityInput = within(addressPanel).getByDisplayValue("San Francisco");

    await user.clear(streetInput);
    await user.type(streetInput, "123 Main Street");

    await user.clear(cityInput);
    await user.type(cityInput, "Rochester");

    await user.click(within(addressPanel).getByRole("button", { name: /save/i }));

    expect(screen.getByText("123 Main Street")).toBeInTheDocument();
    expect(screen.getByText("Rochester")).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem("careconnect.profile") as string);
    expect(saved.address.street).toBe("123 Main Street");
    expect(saved.address.city).toBe("Rochester");
    expect(saved.personal.firstName).toBe("Robert");
  });

  test("saves Medical Information including textarea values", async () => {
    const user = userEvent.setup();
    renderScreen();

    const medicalPanel = screen
      .getByText("Medical Information")
      .closest(".panel") as HTMLElement;

    await user.click(within(medicalPanel).getByRole("button", { name: /edit/i }));

    const doctorInput = within(medicalPanel).getByDisplayValue("Dr. Sarah Mitchell");
    const textareas = within(medicalPanel).getAllByRole("textbox");

    const allergiesTextarea = textareas.find(
      (el) => (el as HTMLTextAreaElement).value.includes("Penicillin, Shellfish")
    ) as HTMLTextAreaElement;

    const conditionsTextarea = textareas.find(
      (el) =>
        (el as HTMLTextAreaElement).value.includes("Parkinson’s Disease") &&
        (el as HTMLTextAreaElement).value.includes("Hypertension") &&
        (el as HTMLTextAreaElement).value.includes("Mild Osteoarthritis")
    ) as HTMLTextAreaElement;

    expect(allergiesTextarea).toBeDefined();
    expect(conditionsTextarea).toBeDefined();

    await user.clear(doctorInput);
    await user.type(doctorInput, "Dr. Jane Smith");

    await user.clear(allergiesTextarea);
    await user.type(allergiesTextarea, "Latex, Dust");

    await user.clear(conditionsTextarea);
    await user.type(conditionsTextarea, "Hypertension\nArthritis");

    await user.click(within(medicalPanel).getByRole("button", { name: /save/i }));

    expect(screen.getByText("Dr. Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Latex, Dust")).toBeInTheDocument();

    const medicalConditionsLabel = within(medicalPanel).getByText("Medical Conditions");
    const medicalConditionsField = medicalConditionsLabel.closest(".field") as HTMLElement;
    const readonlyBlocks = medicalConditionsField.querySelectorAll(".readonly");

    expect(readonlyBlocks.length).toBeGreaterThan(0);

    const medicalConditionsValue = readonlyBlocks[0] as HTMLElement;
    expect(medicalConditionsValue.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Hypertension Arthritis"
    );

    const saved = JSON.parse(localStorage.getItem("careconnect.profile") as string);
    expect(saved.medical.primaryDoctor).toBe("Dr. Jane Smith");
    expect(saved.medical.allergies).toBe("Latex, Dust");
    expect(saved.medical.medicalConditions).toBe("Hypertension\nArthritis");
  });

  test("loads profile from localStorage on first render", () => {
    localStorage.setItem(
      "careconnect.profile",
      JSON.stringify({
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
      })
    );

    renderScreen();

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
    expect(screen.getByText("789 Pine Street")).toBeInTheDocument();
    expect(screen.getByText("Seattle")).toBeInTheDocument();
    expect(screen.getByText("Dr. House")).toBeInTheDocument();
    expect(screen.getByText("Aetna")).toBeInTheDocument();
  });

  test("uses default profile when localStorage contains invalid JSON", () => {
    localStorage.setItem("careconnect.profile", "{bad json");

    renderScreen();

    expect(screen.getByText("Robert")).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
    expect(screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
  });

  test("calls navigate on logout and calls careconnect.quitApp on quit", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: "Mock Logout" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    await user.click(screen.getByRole("button", { name: "Mock Quit" }));
    expect(mockQuitApp).toHaveBeenCalledTimes(1);
  });
});