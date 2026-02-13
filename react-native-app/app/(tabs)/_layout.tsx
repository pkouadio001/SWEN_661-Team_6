import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import GlobalHeader from "@/components/GlobalHeader";

import { EmergencyContactProvider } from "@/context/EmergencyContactContext";
import { MessagesProvider } from "@/context/MessagesContext";
import { ScheduledAppointmentsProvider } from "@/context/ScheduledAppointmentsContext";
import { TasksProvider } from "@/context/TasksContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <ScheduledAppointmentsProvider>
          <EmergencyContactProvider>
            <MessagesProvider>
              <View style={styles.container}>
                <Stack screenOptions={{ headerShown: false }} />
                <GlobalHeader />
              </View>
            </MessagesProvider>
          </EmergencyContactProvider>
        </ScheduledAppointmentsProvider>
      </TasksProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
