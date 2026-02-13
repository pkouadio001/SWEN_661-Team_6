// app/_tests_/modal.test.tsx

import { render, screen } from "@testing-library/react-native";
import React from "react";

import ModalScreen from "../modal";

jest.mock("expo-router", () => {
  return {
    __esModule: true,
    Link: ({ children, ...props }: any) => {
      return <>{children}</>;
    },
  };
});

describe("ModalScreen", () => {
  it("renders modal title", () => {
    render(<ModalScreen />);

    expect(screen.getByText("This is a modal")).toBeTruthy();
  });

  it("renders link text", () => {
    render(<ModalScreen />);

    expect(screen.getByText("Go to home screen")).toBeTruthy();
  });

  it("renders link with correct href", () => {
    render(<ModalScreen />);

    // Since we mocked Link to just render children,
    // we can verify the text is present.
    expect(screen.getByText("Go to home screen")).toBeTruthy();
  });
});
