// app/_tests_/index.test.tsx

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { TextInput } from "react-native";

import Index from "../index";

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const router = { push, replace };
  return {
    __esModule: true,
    router,
    default: { router },
    __mock: { push, replace },
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

const getRouterMocks = (): { push: jest.Mock; replace: jest.Mock } => {
  return require("expo-router").__mock as {
    push: jest.Mock;
    replace: jest.Mock;
  };
};

const getThemeMocks = (): { useTheme: jest.Mock } => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/context/ThemeContext").__mock as { useTheme: jest.Mock };
};

// Helper: distinguish between the Login tab text and Login submit button text
const getLoginTabAndButton = () => {
  const all = screen.getAllByText("Login");
  // In your UI: first is the "Login" tab, second is the "Login" submit button
  // If order ever flips, we still have both references here.
  return { tab: all[0], button: all[1] };
};

describe("Index (Login Screen)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: false,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });
  });

  it("renders the login screen (texts, inputs, links)", () => {
    render(<Index />);

    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getByText("Your Healthcare Partner")).toBeTruthy();

    expect(screen.getByText("Welcome Back")).toBeTruthy();
    expect(
      screen.getByText("Enter your credentials to access your account"),
    ).toBeTruthy();

    expect(screen.getByText("Username")).toBeTruthy();
    expect(screen.getByPlaceholderText("username")).toBeTruthy();

    expect(screen.getByText("PIN Number")).toBeTruthy();
    expect(screen.getByText("Enter your 6-digit PIN")).toBeTruthy();

    // Tabs / buttons / links
    expect(screen.getAllByText("Login").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Register")).toBeTruthy();
    expect(screen.getByText("Forgot username?")).toBeTruthy();
    expect(screen.getByText("Forgot your PIN?")).toBeTruthy();
  });

  it("navigates to /register when Register tab is pressed", () => {
    render(<Index />);

    fireEvent.press(screen.getByText("Register"));

    expect(getRouterMocks().push).toHaveBeenCalledWith("/register");
  });

  it("navigates to forgot routes when links are pressed", () => {
    render(<Index />);

    fireEvent.press(screen.getByText("Forgot username?"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/forgot-username");

    fireEvent.press(screen.getByText("Forgot your PIN?"));
    expect(getRouterMocks().push).toHaveBeenCalledWith("/forgot-pin");
  });

  it("shows error if username is empty", () => {
    render(<Index />);

    fireEvent.changeText(screen.getByPlaceholderText("username"), "   ");

    const { button } = getLoginTabAndButton();
    fireEvent.press(button);

    expect(screen.getByText("Username is required.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalledWith("/dashboard");
  });

  it("shows error if PIN is incomplete", () => {
    render(<Index />);

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    const pinBoxes = inputs.slice(1, 7); // username is inputs[0]

    fireEvent.changeText(pinBoxes[0], ""); // make PIN invalid

    const { button } = getLoginTabAndButton();
    fireEvent.press(button);

    expect(screen.getByText("Please enter your 6-digit PIN.")).toBeTruthy();
    expect(getRouterMocks().push).not.toHaveBeenCalledWith("/dashboard");
  });

  it("logs in and routes to /dashboard when username + 6-digit PIN are valid", async () => {
    jest.useFakeTimers();

    render(<Index />);

    fireEvent.changeText(screen.getByPlaceholderText("username"), "JDoe");

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    const pinBoxes = inputs.slice(1, 7);

    fireEvent.changeText(pinBoxes[0], "1");
    fireEvent.changeText(pinBoxes[1], "2");
    fireEvent.changeText(pinBoxes[2], "3");
    fireEvent.changeText(pinBoxes[3], "4");
    fireEvent.changeText(pinBoxes[4], "5");
    fireEvent.changeText(pinBoxes[5], "6");

    const { button } = getLoginTabAndButton();
    fireEvent.press(button);

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(getRouterMocks().push).toHaveBeenCalledWith("/dashboard");
    });

    jest.useRealTimers();
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({
      highContrastMode: true,
      setHighContrastMode: jest.fn(),
      resetTheme: jest.fn(),
    });

    render(<Index />);

    expect(screen.getByText("CareConnect")).toBeTruthy();
    expect(screen.getAllByText("Login").length).toBeGreaterThanOrEqual(2);
  });
});
