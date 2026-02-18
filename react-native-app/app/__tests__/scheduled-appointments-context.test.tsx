import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import {
    ScheduledAppointmentsProvider,
    useScheduledAppointments,
} from "@/context/ScheduledAppointmentsContext";

// ✅ IMPORTANT: mock vars must be prefixed with "mock" to be allowed inside jest.mock factory
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

function TestConsumer() {
  const {
    totalAppointments,
    confirmedAppointmentIds,
    upcomingAppointmentsCount,
    confirmAppointment,
    isAppointmentConfirmed,
    resetCount,
    allAppointments,
  } = useScheduledAppointments();

  return (
    <View>
      <Text testID="total">{String(totalAppointments)}</Text>
      <Text testID="confirmed">{JSON.stringify(confirmedAppointmentIds)}</Text>
      <Text testID="upcoming">{String(upcomingAppointmentsCount)}</Text>
      <Text testID="allCount">{String(allAppointments.length)}</Text>

      <Text testID="is1Confirmed">{String(isAppointmentConfirmed(1))}</Text>

      <Pressable testID="confirm1" onPress={() => confirmAppointment(1)}>
        <Text>confirm 1</Text>
      </Pressable>

      <Pressable testID="confirm3" onPress={() => confirmAppointment(3)}>
        <Text>confirm 3</Text>
      </Pressable>

      <Pressable testID="reset" onPress={resetCount}>
        <Text>reset</Text>
      </Pressable>
    </View>
  );
}
describe("ScheduledAppointmentsContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // ✅ Lock "now" so upcomingAppointmentsCount is stable.
    // Jan 25, 2026 => appointments on Jan 27/28/29/31 are within next 7 days.
    jest.setSystemTime(new Date("2026-01-25T12:00:00.000Z"));

    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockRemoveItem.mockReset();

    // default: storage empty
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("loads initial state (storage empty): defaults dataset size + upcoming count", async () => {
    render(
      <ScheduledAppointmentsProvider>
        <TestConsumer />
      </ScheduledAppointmentsProvider>,
    );

    // totalAppointments should default to dataset size (8)
    expect(screen.getByTestId("allCount").props.children).toBe("8");
    expect(screen.getByTestId("total").props.children).toBe("8");

    // upcoming within 7 days from Jan 25, 2026 (Jan 27/28/29/31) => 4
    await waitFor(() => {
      expect(screen.getByTestId("upcoming").props.children).toBe("4");
    });

    // storage load was called for both keys
    expect(mockGetItem).toHaveBeenCalledWith("scheduled_totalAppointments_v1");
    expect(mockGetItem).toHaveBeenCalledWith(
      "scheduled_confirmedAppointmentIds_v1",
    );
  });
  it("loads stored totalAppointments + confirmedAppointmentIds from AsyncStorage", async () => {
    mockGetItem.mockImplementation(async (key: string) => {
      if (key === "scheduled_totalAppointments_v1") return "99";
      if (key === "scheduled_confirmedAppointmentIds_v1")
        return JSON.stringify([1, 3, "bad", 999]);
      return null;
    });

    render(
      <ScheduledAppointmentsProvider>
        <TestConsumer />
      </ScheduledAppointmentsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("total").props.children).toBe("99");
    });

    // should filter non-numbers out; keeps 1,3,999
    expect(screen.getByTestId("confirmed").props.children).toBe(
      JSON.stringify([1, 3, 999]),
    );
    expect(screen.getByTestId("is1Confirmed").props.children).toBe("true");
  });

  it("confirmAppointment adds id once and decreases upcomingAppointmentsCount if it was within week", async () => {
    render(
      <ScheduledAppointmentsProvider>
        <TestConsumer />
      </ScheduledAppointmentsProvider>,
    );

    // initial upcoming = 4
    await waitFor(() => {
      expect(screen.getByTestId("upcoming").props.children).toBe("4");
    });

    // appointment id 3 is Jan 27, 2026 (within week) => upcoming should drop by 1
    fireEvent.press(screen.getByTestId("confirm3"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmed").props.children).toBe(
        JSON.stringify([3]),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("upcoming").props.children).toBe("3");
    });

    // confirm same again -> still once
    fireEvent.press(screen.getByTestId("confirm3"));
    await waitFor(() => {
      expect(screen.getByTestId("confirmed").props.children).toBe(
        JSON.stringify([3]),
      );
    });
  });

  it("persists totalAppointments + confirmedAppointmentIds via setItem", async () => {
    render(
      <ScheduledAppointmentsProvider>
        <TestConsumer />
      </ScheduledAppointmentsProvider>,
    );
    // confirm appointment 1 (not within next week? Jan 28 is within week but id 1 is Jan 28 yes within week)
    fireEvent.press(screen.getByTestId("confirm1"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmed").props.children).toBe(
        JSON.stringify([1]),
      );
    });

    // The provider has separate effects; we should see setItem called for confirmed list
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(
        "scheduled_confirmedAppointmentIds_v1",
        JSON.stringify([1]),
      );
    });

    // totalAppointments persists too (may be called on mount)
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(
        "scheduled_totalAppointments_v1",
        expect.any(String),
      );
    });
  });

  it("resetCount resets state and removes storage keys", async () => {
    render(
      <ScheduledAppointmentsProvider>
        <TestConsumer />
      </ScheduledAppointmentsProvider>,
    );

    fireEvent.press(screen.getByTestId("confirm1"));

    await waitFor(() => {
      expect(screen.getByTestId("confirmed").props.children).toBe(
        JSON.stringify([1]),
      );
    });

    fireEvent.press(screen.getByTestId("reset"));

    // state resets
    await waitFor(() => {
      expect(screen.getByTestId("confirmed").props.children).toBe(
        JSON.stringify([]),
      );
      expect(screen.getByTestId("total").props.children).toBe("8");
    });

    // storage cleared
    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith(
        "scheduled_totalAppointments_v1",
      );
      expect(mockRemoveItem).toHaveBeenCalledWith(
        "scheduled_confirmedAppointmentIds_v1",
      );
    });
  });
});
