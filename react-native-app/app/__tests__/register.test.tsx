// app/_tests_/register.test.tsx

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { TextInput } from "react-native";

import Register from "../register";

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const router = { push, replace, back };

  return {
    __esModule: true,
    router,
    default: { router },
    __mock: { push, replace, back },
  };
});

jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
    setHighContrastMode: jest.fn(),
    resetTheme: jest.fn(),
  }));
  return { __esModule: true, useTheme, __mock: { useTheme } };
});

const getRouterMocks = (): { replace: jest.Mock; back: jest.Mock } => {
  return require("expo-router").__mock as {
    replace: jest.Mock;
    back: jest.Mock;
  };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};

// Helper: since "Register" appears twice, this picks the BUTTON one (second occurrence)
const pressRegisterButton = () => {
  const all = screen.getAllByText("Register");
  // [0] is header title, [1] is the button label
  fireEvent.press(all[1]);
};

describe("Register Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders main UI", () => {
    render(<Register />);

    // "Register" appears twice; just assert we have 2 of them
    expect(screen.getAllByText("Register").length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText("Create Account")).toBeTruthy();
    expect(
      screen.getByText("Fill in your details to get started"),
    ).toBeTruthy();

    expect(screen.getByText("Full Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Username")).toBeTruthy();
    expect(screen.getByText("Create PIN")).toBeTruthy();

    expect(screen.getByText("Already have an account? Login")).toBeTruthy();
  });

  it("shows error when Full Name is empty", () => {
    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText("Full name"), "   ");
    pressRegisterButton();

    expect(screen.getByText("Full name is required.")).toBeTruthy();
    expect(getRouterMocks().replace).not.toHaveBeenCalled();
  });

  it("shows error when Email is empty", () => {
    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "   ");
    pressRegisterButton();

    expect(screen.getByText("Email is required.")).toBeTruthy();
    expect(getRouterMocks().replace).not.toHaveBeenCalled();
  });

  it("shows error when Username is empty", () => {
    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText("Username"), "   ");
    pressRegisterButton();

    expect(screen.getByText("Username is required.")).toBeTruthy();
    expect(getRouterMocks().replace).not.toHaveBeenCalled();
  });

  it("shows error when PIN is incomplete", () => {
    render(<Register />);

    // Grab all TextInputs; last 6 are the PIN boxes
    const allInputs = screen.UNSAFE_getAllByType(TextInput);
    const pinInputs = allInputs.slice(-6);

    fireEvent.changeText(pinInputs[0], "1");
    fireEvent.changeText(pinInputs[1], "2");
    fireEvent.changeText(pinInputs[2], "3");
    fireEvent.changeText(pinInputs[3], "4");
    fireEvent.changeText(pinInputs[4], "5");
    // pinInputs[5] left empty

    pressRegisterButton();

    expect(screen.getByText("Enter a 6-digit PIN.")).toBeTruthy();
    expect(getRouterMocks().replace).not.toHaveBeenCalled();
  });

  it("registers and routes to /dashboard when all fields are valid", async () => {
    render(<Register />);

    const allInputs = screen.UNSAFE_getAllByType(TextInput);
    const pinInputs = allInputs.slice(-6);

    fireEvent.changeText(pinInputs[0], "1");
    fireEvent.changeText(pinInputs[1], "2");
    fireEvent.changeText(pinInputs[2], "3");
    fireEvent.changeText(pinInputs[3], "4");
    fireEvent.changeText(pinInputs[4], "5");
    fireEvent.changeText(pinInputs[5], "6");

    pressRegisterButton();

    jest.advanceTimersByTime(400);

    await waitFor(() => {
      expect(getRouterMocks().replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("Back arrow calls router.back()", () => {
    render(<Register />);

    fireEvent.press(screen.getByText("←"));

    expect(getRouterMocks().back).toHaveBeenCalledTimes(1);
  });

  it("Already have an account? Login routes to /", () => {
    render(<Register />);

    fireEvent.press(screen.getByText("Already have an account? Login"));

    expect(getRouterMocks().replace).toHaveBeenCalledWith("/");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<Register />);

    expect(screen.getByText("Create Account")).toBeTruthy();
    expect(screen.getAllByText("Register").length).toBeGreaterThanOrEqual(2);
  });
});
