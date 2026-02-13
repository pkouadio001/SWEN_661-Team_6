// app/_tests_/explore.test.tsx

// Mock expo-image
import { render, screen } from "@testing-library/react-native";
import React from "react";
import TabTwoScreen from "../(tabs)/explore";

jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return {
    Image: (props: any) => <View {...props} />,
  };
});

// Mock ParallaxScrollView
jest.mock("@/components/parallax-scroll-view", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockParallaxScrollView = ({ children }: any) => {
    return React.createElement(View, null, children);
  };

  return MockParallaxScrollView;
});

// Mock Collapsible
jest.mock("@/components/ui/collapsible", () => {
  const { View, Text } = require("react-native");
  return {
    Collapsible: ({ title, children }: any) => (
      <View>
        <Text>{title}</Text>
        {children}
      </View>
    ),
  };
});

// Mock ExternalLink
jest.mock("@/components/external-link", () => {
  const { View } = require("react-native");
  return {
    ExternalLink: ({ children }: any) => <View>{children}</View>,
  };
});

// Mock ThemedText
jest.mock("@/components/themed-text", () => {
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children }: any) => <Text>{children}</Text>,
  };
});

// Mock ThemedView
jest.mock("@/components/themed-view", () => {
  const { View } = require("react-native");
  return {
    ThemedView: ({ children }: any) => <View>{children}</View>,
  };
});

// Mock IconSymbol
jest.mock("@/components/ui/icon-symbol", () => {
  const { View } = require("react-native");
  return {
    IconSymbol: () => <View />,
  };
});

// Mock Fonts constant
jest.mock("@/constants/theme", () => ({
  Fonts: {
    rounded: "System",
    mono: "System",
  },
}));

describe("TabTwoScreen (Explore)", () => {
  it("renders main UI", () => {
    render(<TabTwoScreen />);

    expect(screen.getByText("Explore")).toBeTruthy();
    expect(
      screen.getByText(
        "This app includes example code to help you get started.",
      ),
    ).toBeTruthy();

    expect(screen.getByText("File-based routing")).toBeTruthy();
    expect(screen.getByText("Android, iOS, and web support")).toBeTruthy();
    expect(screen.getByText("Images")).toBeTruthy();
    expect(screen.getByText("Light and dark mode components")).toBeTruthy();
    expect(screen.getByText("Animations")).toBeTruthy();
  });
});
