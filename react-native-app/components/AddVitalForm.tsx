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

interface AddVitalFormProps {
  visible: boolean;
  onClose: () => void;
}

const vitalTypes = [
  { label: "Blood Pressure", placeholder: "120/80" },
  { label: "Heart Rate", placeholder: "72 bpm" },
  { label: "Temperature", placeholder: "98.6°F" },
  { label: "Blood Sugar", placeholder: "105 mg/dL" },
  { label: "Weight", placeholder: "165 lbs" },
  { label: "Oxygen Level", placeholder: "98%" },
];

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AddVitalForm({ visible, onClose }: AddVitalFormProps) {
  const { addEntry } = useHealthLogs();
  const { highContrastMode } = useTheme();

  const now = useMemo(() => new Date(), []);
  const [vitalType, setVitalType] = useState(vitalTypes[0].label);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(formatDate(now));
  const [time, setTime] = useState(formatTime(now));

  const selectedType = useMemo(
    () => vitalTypes.find((t) => t.label === vitalType) ?? vitalTypes[0],
    [vitalType],
  );

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    addEntry({
      type: vitalType,
      category: "vital",
      date,
      time,
      value: value.trim(),
      icon: "vital",
    });

    onClose();
  };

  const labelColor = highContrastMode ? "#fff" : "#101828";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} accessible={true} accessibilityViewIsModal={true}>
      <View style={styles.overlay} accessible={true} accessibilityRole="none" accessibilityLabel="Vital measurement form overlay">
        <View
          style={[
            styles.card,
            highContrastMode
              ? { backgroundColor: "#1a1a1a", borderColor: "#FFFF00", borderWidth: 2 }
              : { backgroundColor: "#fff" },
          ]}
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Vital measurement form"
        >
          <Text style={[styles.title, { color: labelColor }]} accessible={true} accessibilityRole="header">Add Vital Measurement</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 8 }} style={{ maxHeight: "80%" }} accessible={false}>
            {/* Measurement Type */}
            <Text style={[styles.label, { color: labelColor }]} accessible={true} accessibilityRole="text">Measurement Type</Text>

            <View style={styles.typeGrid} accessible={false}>
              {vitalTypes.map((t) => {
                const selected = t.label === vitalType;
                return (
                  <Pressable
                    key={t.label}
                    onPress={() => setVitalType(t.label)}
                    style={[
                      styles.typeBtn,
                      selected
                        ? highContrastMode
                          ? { backgroundColor: "#FFFF00" }
                          : { backgroundColor: "#155DFC" }
                        : highContrastMode
                          ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                          : { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", borderWidth: 1 },
                    ]}
                    accessible={true}
                    accessibilityRole="radio"
                    accessibilityLabel={`${t.label} measurement type`}
                    accessibilityHint={`Select ${t.label} as measurement type`}
                    accessibilityState={{ checked: selected }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "800",
                        textAlign: "center",
                        color: selected ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? "#fff" : "#101828"),
                      }}
                      accessible={false}
                    >
                      {t.label}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 11,
                        textAlign: "center",
                        opacity: 0.9,
                        color: selected ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? "#fff" : "#6B7280"),
                      }}
                      accessible={false}
                    >
                      {t.placeholder}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Value */}
            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]} accessible={true} accessibilityRole="text">Value</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={selectedType.placeholder}
              placeholderTextColor={highContrastMode ? "rgba(255,255,255,0.6)" : "#9CA3AF"}
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
              accessible={true}
              accessibilityLabel={`${vitalType} value`}
              accessibilityHint={`Enter value for ${vitalType}`}
            />

            {/* Date */}
            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]} accessible={true} accessibilityRole="text">Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
              accessible={true}
              accessibilityLabel="Date"
              accessibilityHint="Date when vital was measured"
            />

            {/* Time */}
            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]} accessible={true} accessibilityRole="text">Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
              accessible={true}
              accessibilityLabel="Time"
              accessibilityHint="Time when vital was measured"
            />
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions} accessible={false}>
            <Pressable
              onPress={onClose}
              style={[
                styles.actionBtn,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                  : { backgroundColor: "#F3F4F6" },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Close vital measurement form without saving"
            >
              <Text style={{ fontWeight: "900", color: highContrastMode ? "#fff" : "#101828" }} accessible={false}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[
                styles.actionBtn,
                !canSubmit
                  ? highContrastMode
                    ? { backgroundColor: "#666" }
                    : { backgroundColor: "#D1D5DB" }
                  : highContrastMode
                    ? { backgroundColor: "#FFFF00" }
                    : { backgroundColor: "#155DFC" },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add vital entry"
              accessibilityHint={canSubmit ? "Save and add vital measurement to your health logs" : "Enter a value to enable"}
              accessibilityState={{ disabled: !canSubmit }}
            >
              <Text
                style={{
                  fontWeight: "900",
                  color: !canSubmit
                    ? highContrastMode
                      ? "#999"
                      : "#9CA3AF"
                    : highContrastMode
                      ? "#000"
                      : "#fff",
                }}
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
    fontWeight: "900",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBtn: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
