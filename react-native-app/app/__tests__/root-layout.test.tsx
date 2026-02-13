// app/_tests_/root-layout.test.tsx

import { render, screen } from "@testing-library/react-native";
import React from "react";

/**
 * ✅ Import RootLayout AFTER mocks
 */
import RootLayout from "../_layout";

/**
 * ✅ IMPORTANT: Mock AsyncStorage BEFORE importing RootLayout
 * (prevents "NativeModule: AsyncStorage is null")
 */
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {},
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

/**
 * Mock expo-router Stack so we can assert props.
 */
jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const Stack = (props: any) => (
    <View testID="mock-stack">
      <View testID="mock-stack-props" {...props} />
    </View>
  );

  return {
    __esModule: true,
    Stack,
  };
});

/**
 * Mock GlobalHeader so we can detect it rendered.
 */
jest.mock("@/components/GlobalHeader", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: () => <Text testID="global-header">GlobalHeader</Text>,
  };
});

/**
 * Mock ALL Providers used by _layout so we don't load real contexts.
 * Add more here if your _layout imports additional providers.
 */
jest.mock("@/context/ThemeContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    ThemeProvider: ({ children }: any) => <>{children}</>,
  };
});

jest.mock("@/context/TasksContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    TasksProvider: ({ children }: any) => <>{children}</>,
  };
});

jest.mock("@/context/ScheduledAppointmentsContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    ScheduledAppointmentsProvider: ({ children }: any) => <>{children}</>,
  };
});

jest.mock("@/context/EmergencyContactContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    EmergencyContactProvider: ({ children }: any) => <>{children}</>,
  };
});

describe("RootLayout", () => {
  it("renders Stack with headerShown:false and renders GlobalHeader", () => {
    render(<RootLayout />);

    expect(screen.getByTestId("mock-stack")).toBeTruthy();

    const propsNode = screen.getByTestId("mock-stack-props");
    expect(propsNode.props.screenOptions).toEqual({ headerShown: false });

    expect(screen.getByTestId("global-header")).toBeTruthy();
    expect(screen.getByText("GlobalHeader")).toBeTruthy();
  });

  it("does not crash (smoke test)", () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
