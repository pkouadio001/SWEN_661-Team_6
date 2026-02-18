import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useHealthLogs } from "@/context/HealthLogsContext";
import { useTheme } from "@/context/ThemeContext";

interface AddMoodFormProps {
  visible: boolean;
  onClose: () => void;
}

const moodOptions = [
  "😄 Very Happy",
  "😊 Happy",
  "😐 Neutral",
  "😔 Sad",
  "😢 Very Sad",
  "😤 Frustrated",
];

function formatDate(d: Date) {
  // "Jan 25, 2026"
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(d: Date) {
  // "10:30 AM"
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function AddMoodForm({ visible, onClose }: AddMoodFormProps) {
  const { addEntry } = useHealthLogs();
  const { highContrastMode } = useTheme();

  const now = useMemo(() => new Date(), []);
  const [mood, setMood] = useState("😊 Happy");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(formatDate(now));
  const [time, setTime] = useState(formatTime(now));

  const handleSubmit = () => {
    addEntry({
      type: `Mood: ${mood}`,
      category: "mood",
      date,
      time,
      value: mood,
      icon: "mood",
      notes, // include if your model supports it; remove if not
    });

    onClose();
  };

  const cardStyle = [
    styles.card,
    highContrastMode
      ? { backgroundColor: "#1a1a1a", borderColor: "#FFFF00", borderWidth: 2 }
      : { backgroundColor: "#fff" },
  ];

  const labelColor = highContrastMode ? "#fff" : "#101828";

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View 
        style={styles.overlay}
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel="Mood logging form overlay"
      >
        <View 
          style={cardStyle}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Mood logging form"
        >
          <Text 
            style={[styles.title, { color: labelColor }]}
            accessible={true}
            accessibilityRole="header"
          >
            Log Mood
          </Text>

          <ScrollView 
            contentContainerStyle={{ paddingBottom: 8 }}
            accessible={false}
          >
            <Text 
              style={[styles.label, { color: labelColor }]}
              accessible={true}
              accessibilityRole="text"
            >
              How are you feeling?
            </Text>

            <View 
              style={styles.grid}
              accessible={false}
            >
              {moodOptions.map((option) => {
                const selected = mood === option;
                const moodLabel = option.split(" ").slice(1).join(" ");
                return (
                  <Pressable
                    key={option}
                    onPress={() => setMood(option)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${moodLabel} mood option`}
                    accessibilityHint={`Select ${moodLabel} as your current mood`}
                    accessibilityState={{ selected }}
                    style={[
                      styles.moodBtn,
                      selected
                        ? highContrastMode
                          ? { backgroundColor: "#FFFF00" }
                          : { backgroundColor: "#155DFC" }
                        : highContrastMode
                          ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                          : { backgroundColor: "#F3F4F6" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.moodEmoji,
                        { color: selected ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? "#fff" : "#101828") },
                      ]}
                      accessible={false}
                    >
                      {option.split(" ")[0]}
                    </Text>
                    <Text
                      style={[
                        styles.moodText,
                        { color: selected ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? "#fff" : "#101828") },
                      ]}
                      accessible={false}
                    >
                      {moodLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text 
              style={[styles.label, { color: labelColor, marginTop: 12 }]}
              accessible={true}
              accessibilityRole="text"
            >
              Notes (optional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about your mood..."
              placeholderTextColor={highContrastMode ? "#bbb" : "#9CA3AF"}
              multiline
              accessible={true}
              accessibilityLabel="Mood notes"
              accessibilityHint="Optional text field for additional notes about your mood"
              style={[
                styles.input,
                styles.textarea,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
            />

            <Text 
              style={[styles.label, { color: labelColor, marginTop: 12 }]}
              accessible={true}
              accessibilityRole="text"
            >
              Date
            </Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              accessible={true}
              accessibilityLabel="Date"
              accessibilityHint="Date when mood was recorded"
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
            />

            <Text 
              style={[styles.label, { color: labelColor, marginTop: 12 }]}
              accessible={true}
              accessibilityRole="text"
            >
              Time
            </Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              accessible={true}
              accessibilityLabel="Time"
              accessibilityHint="Time when mood was recorded"
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
            />
          </ScrollView>

          <View 
            style={styles.actions}
            accessible={false}
          >
            <Pressable
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Close mood logging form without saving"
              style={[
                styles.actionBtn,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                  : { backgroundColor: "#F3F4F6" },
              ]}
            >
              <Text 
                style={{ fontWeight: "700", color: highContrastMode ? "#fff" : "#101828" }}
                accessible={false}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add mood entry"
              accessibilityHint="Save and add this mood entry to your health logs"
              style={[
                styles.actionBtn,
                highContrastMode ? { backgroundColor: "#FFFF00" } : { backgroundColor: "#155DFC" },
              ]}
            >
              <Text 
                style={{ fontWeight: "800", color: highContrastMode ? "#000" : "#fff" }}
                accessible={false}
              >
                Add
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodBtn: {
    width: "31%",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 18,
    fontWeight: "800",
  },
  moodText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
});
