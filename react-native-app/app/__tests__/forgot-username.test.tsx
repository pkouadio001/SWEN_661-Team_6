// app/_tests_/forgot-username.test.tsx
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";

import ForgotUsernameScreen from "../forgot-username";

/**
 * ThemeContext mock (safe)
 */
jest.mock("@/context/ThemeContext", () => {
  const useTheme = jest.fn(() => ({
    highContrastMode: false,
  }));

  return {
    useTheme,
    __mock: { useTheme },
  };
});
const getThemeMocks = (): { useTheme: jest.Mock } => {
   
  const mod = require("@/context/ThemeContext");

  return mod.__mock as { useTheme: jest.Mock };
};

const getRouterMocks = (): { replace: jest.Mock } => {
  const mod = require("expo-router");
  return mod.__mock as { replace: jest.Mock };
};

describe("ForgotUsernameScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: false });
  });

  it("renders title, instructions, input, and buttons", () => {
    render(<ForgotUsernameScreen />);

    expect(screen.getByText("Forgot Username")).toBeTruthy();
    expect(
      screen.getByText(
        "Enter your email address and we will send you a link to recover your username.",
      ),
    ).toBeTruthy();

    expect(screen.getByText("Email Address")).toBeTruthy();
    expect(screen.getByPlaceholderText("example@email.com")).toBeTruthy();

    expect(screen.getByText("Send Recovery Link")).toBeTruthy();
    expect(screen.getByText("Back to Login")).toBeTruthy();
  });

  it("shows error when email is empty", () => {
    render(<ForgotUsernameScreen />);

    fireEvent.press(screen.getByText("Send Recovery Link"));

    expect(screen.getByText("Please enter your email address.")).toBeTruthy();
  });

  it("shows error when email is invalid", () => {
    render(<ForgotUsernameScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("example@email.com"),
      "not-an-email",
    );
    fireEvent.press(screen.getByText("Send Recovery Link"));

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeTruthy();
  });

  it("shows success message after simulated API delay (valid email)", async () => {
    jest.useFakeTimers();

    render(<ForgotUsernameScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("example@email.com"),
      "test@example.com",
    );
    fireEvent.press(screen.getByText("Send Recovery Link"));

    // the screen awaits a Promise(setTimeout 800)
    jest.advanceTimersByTime(800);

    await waitFor(() => {
      expect(
        screen.getByText(
          "A username recovery link has been sent to your email.",
        ),
      ).toBeTruthy();
    });

    jest.useRealTimers();
  });

  it("Back to Login replaces route to /", () => {
    render(<ForgotUsernameScreen />);

    fireEvent.press(screen.getByText("Back to Login"));

    expect(getRouterMocks().replace).toHaveBeenCalledWith("/");
  });

  it("renders in high-contrast mode (smoke test)", () => {
    getThemeMocks().useTheme.mockReturnValue({ highContrastMode: true });

    render(<ForgotUsernameScreen />);

    expect(screen.getByText("Forgot Username")).toBeTruthy();
    expect(screen.getByText("Send Recovery Link")).toBeTruthy();
  });
});
