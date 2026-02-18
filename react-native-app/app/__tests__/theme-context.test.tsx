import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
// ✅ Proper AsyncStorage mock
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) => mockGetItem(...args),
    setItem: (...args: any[]) => mockSetItem(...args),
    removeItem: (...args: any[]) => mockRemoveItem(...args),
  },
}));

// 🔁 adjust path if needed

function Consumer() {
  const { highContrastMode, setHighContrastMode, resetTheme } = useTheme();

  return (
    <View>
      <Text testID="mode">{String(highContrastMode)}</Text>

      <Pressable testID="enable" onPress={() => setHighContrastMode(true)}>
        <Text>Enable</Text>
      </Pressable>

      <Pressable testID="disable" onPress={() => setHighContrastMode(false)}>
        <Text>Disable</Text>
      </Pressable>

      <Pressable testID="reset" onPress={() => resetTheme()}>
        <Text>Reset</Text>
      </Pressable>
    </View>
  );
}
describe("ThemeContext", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockRemoveItem.mockReset();

    mockSetItem.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);
  });

  it("defaults to false when nothing in storage", async () => {
    mockGetItem.mockResolvedValue(null);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mode").props.children).toBe("false");
    });
  });

  it("loads highContrastMode from AsyncStorage", async () => {
    mockGetItem.mockResolvedValue(JSON.stringify(true));

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mode").props.children).toBe("true");
    });
  });

  it("setHighContrastMode updates state and persists to storage", async () => {
    mockGetItem.mockResolvedValue(null);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId("enable"));

    await waitFor(() => {
      expect(screen.getByTestId("mode").props.children).toBe("true");
    });

    expect(mockSetItem).toHaveBeenCalledWith(
      "highContrastMode_v1",
      JSON.stringify(true),
    );
  });
  it("resetTheme sets mode to false and removes storage key", async () => {
    mockGetItem.mockResolvedValue(JSON.stringify(true));

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mode").props.children).toBe("true");
    });

    fireEvent.press(screen.getByTestId("reset"));

    await waitFor(() => {
      expect(screen.getByTestId("mode").props.children).toBe("false");
    });

    expect(mockRemoveItem).toHaveBeenCalledWith("highContrastMode_v1");
  });

  it("throws error if useTheme used outside provider", () => {
    const Broken = () => {
      useTheme();
      return null;
    };

    expect(() => render(<Broken />)).toThrow(
      "useTheme must be used inside <ThemeProvider />",
    );
  });
});
