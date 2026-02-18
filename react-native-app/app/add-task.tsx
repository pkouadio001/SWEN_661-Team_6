import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTasks } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";

// Function to format time from 24-hour format to 12-hour format with AM/PM
const formatTimeToAMPM = (time24: string): string => {
  if (!time24) return "";

  const [hoursStr, minutesStr] = time24.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr ?? "0");

  const meridiem = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
};

// Function to format date (YYYY-MM-DD) to shortened format like "Jan 25"
const formatDateShortened = (dateString: string): string => {
  if (!dateString) return "";

  // IMPORTANT: Use UTC parsing to avoid timezone day-shift on Android/iOS
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

export default function AddTaskScreen() {
  const { highContrastMode } = useTheme();
  const { addTask } = useTasks();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(""); // Expect YYYY-MM-DD
  const [taskTime, setTaskTime] = useState(""); // Expect HH:mm (24hr)

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    headerBg: highContrastMode ? "#000000" : "#FFFFFF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    title: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    inputBg: highContrastMode ? "#2a2a2a" : "#F9FAFB",
    primary: highContrastMode ? "#FFFF00" : "#155DFC",
    primaryText: highContrastMode ? "#000000" : "#FFFFFF",
  };

  const goBack = () => router.push("/today-tasks");

  const handleSave = () => {
    if (!taskTitle.trim() || !taskDate || !taskTime) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    const formattedTime = formatTimeToAMPM(taskTime);
    const formattedDate = formatDateShortened(taskDate);

    const taskDateTime = `${formattedDate} at ${formattedTime}`;

    addTask({
      title: taskTitle.trim(),
      time: taskDateTime,
      completed: false,
    });

    goBack();
  };

  return (
    <SafeAreaView 
      style={[styles.safe, { backgroundColor: colors.bg }]}
      accessible={false}
    >
      <View 
        style={[styles.screen, { backgroundColor: colors.bg }]}
        accessible={false}
      >
        {/* Header */}
        <View 
          style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}
          accessible={false}
        >
          <View 
            style={styles.headerRow}
            accessible={false}
          >
            <Pressable 
              onPress={goBack} 
              style={styles.backBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Return to tasks list"
            >
              <Text 
                style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? colors.sub : "#101828" }}
                accessible={false}
              >
                ←
              </Text>
            </Pressable>

            <View 
              style={[styles.iconBox, { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" }]}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Add task icon"
            >
              <Text 
                style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900", fontSize: 18 }}
                accessible={false}
              >
                ＋
              </Text>
            </View>

            <View accessible={false}>
              <Text 
                style={[styles.headerTitle, { color: colors.title }]}
                accessible={true}
                accessibilityRole="header"
              >
                Add New Task
              </Text>
              <Text 
                style={[styles.headerSub, { color: colors.sub }]}
                accessible={true}
                accessibilityRole="text"
              >
                Create a task for your routine
              </Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          style={{ flex: 1 }}
          accessible={false}
        >
          <ScrollView 
            contentContainerStyle={styles.content} 
            keyboardShouldPersistTaps="handled"
            accessible={false}
          >
            {/* Form Card */}
            <View 
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              accessible={false}
            >
              <View 
                style={{ marginBottom: 14 }}
                accessible={false}
              >
                <Text 
                  style={[styles.bigTitle, { color: colors.title }]}
                  accessible={true}
                  accessibilityRole="header"
                >
                  Task Details
                </Text>
                <Text 
                  style={[styles.smallSub, { color: colors.sub }]}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Fill in the information below
                </Text>
              </View>

              {/* Title */}
              <View 
                style={{ marginBottom: 12 }}
                accessible={false}
              >
                <Text 
                  style={[styles.label, { color: colors.title }]}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Task Title
                </Text>
                <TextInput
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  placeholder="e.g., Take morning medication"
                  placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                  accessible={true}
                  accessibilityLabel="Task Title"
                  accessibilityHint="Enter a title for your task"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.title,
                    },
                  ]}
                  returnKeyType="next"
                />
              </View>

              {/* Date (YYYY-MM-DD text input for cross-platform simplicity) */}
              <View 
                style={{ marginBottom: 12 }}
                accessible={false}
              >
                <Text 
                  style={[styles.label, { color: colors.title }]}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Date
                </Text>
                <TextInput
                  value={taskDate}
                  onChangeText={setTaskDate}
                  placeholder="YYYY-MM-DD (e.g., 2026-01-25)"
                  placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                  accessible={true}
                  accessibilityLabel="Date"
                  accessibilityHint="Enter task date in format YYYY-MM-DD"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.title,
                    },
                  ]}
                  keyboardType="numbers-and-punctuation"
                />
                <Text 
                  style={{ marginTop: 6, color: colors.sub, fontWeight: "700", fontSize: 12 }}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Stored as: {taskDate ? formatDateShortened(taskDate) : "—"}
                </Text>
              </View>

              {/* Time (HH:mm text input) */}
              <View 
                style={{ marginBottom: 12 }}
                accessible={false}
              >
                <Text 
                  style={[styles.label, { color: colors.title }]}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Time
                </Text>
                <TextInput
                  value={taskTime}
                  onChangeText={setTaskTime}
                  placeholder="HH:mm (e.g., 08:00)"
                  placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                  accessible={true}
                  accessibilityLabel="Time"
                  accessibilityHint="Enter task time in 24-hour format HH:mm"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.title,
                    },
                  ]}
                  keyboardType="numbers-and-punctuation"
                />
                <Text 
                  style={{ marginTop: 6, color: colors.sub, fontWeight: "700", fontSize: 12 }}
                  accessible={true}
                  accessibilityRole="text"
                >
                  Stored as: {taskTime ? formatTimeToAMPM(taskTime) : "—"}
                </Text>
              </View>

              {/* Buttons */}
              <View 
                style={styles.btnRow}
                accessible={false}
              >
                <Pressable
                  onPress={goBack}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityHint="Discard changes and return to tasks list"
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    { borderColor: colors.border, backgroundColor: highContrastMode ? "#1a1a1a" : "#fff" },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text 
                    style={{ color: colors.primary, fontWeight: "900" }}
                    accessible={false}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSave}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Add Task"
                  accessibilityHint="Save task and return to tasks list"
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text 
                    style={{ color: colors.primaryText, fontWeight: "900" }}
                    accessible={false}
                  >
                    Add Task
                  </Text>
                </Pressable>
              </View>
            </View>

            <View 
              style={{ height: 110 }}
              accessible={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },

  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "900" },
  headerSub: { marginTop: 2, fontSize: 13, fontWeight: "700" },

  content: { padding: 16 },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  bigTitle: { fontSize: 20, fontWeight: "900", marginBottom: 4 },
  smallSub: { fontSize: 13, fontWeight: "700" },

  label: { fontSize: 13, fontWeight: "900", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontWeight: "800",
  },

  btnRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  primaryBtn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  secondaryBtn: { flex: 1, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
});
