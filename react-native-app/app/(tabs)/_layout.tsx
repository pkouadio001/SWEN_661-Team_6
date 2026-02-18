import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import GlobalHeader from "@/components/GlobalHeader";

import { EmergencyContactProvider } from "@/context/EmergencyContactContext";
import { HealthLogsProvider } from "@/context/HealthLogsContext";
import { MessagesProvider } from "@/context/MessagesContext";
import { ScheduledAppointmentsProvider } from "@/context/ScheduledAppointmentsContext";
import { TasksProvider } from "@/context/TasksContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TasksProvider>
          <ScheduledAppointmentsProvider>
            <EmergencyContactProvider>
              <MessagesProvider>
                <HealthLogsProvider>
                  <View style={styles.container}>
                    <Stack screenOptions={{ headerShown: false }} />
                    <GlobalHeader />
                  </View>
                </HealthLogsProvider>
              </MessagesProvider>
            </EmergencyContactProvider>
          </ScheduledAppointmentsProvider>
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
