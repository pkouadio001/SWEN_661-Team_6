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

interface AddSymptomsFormProps {
  visible: boolean;
  onClose: () => void;
}

const symptomOptions = [
  "Headache",
  "Fever",
  "Cough",
  "Sore Throat",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Body Aches",
  "Shortness of Breath",
  "Chills",
];

const severities = ["Mild", "Moderate", "Severe"] as const;
type Severity = (typeof severities)[number];

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

export default function AddSymptomsForm({ visible, onClose }: AddSymptomsFormProps) {
  const { addEntry } = useHealthLogs();
  const { highContrastMode } = useTheme();

  const now = useMemo(() => new Date(), []);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<Severity>("Mild");
  const [date, setDate] = useState(formatDate(now));
  const [time, setTime] = useState(formatTime(now));

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    );
  };

  const canSubmit = selectedSymptoms.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const symptomList = selectedSymptoms.join(", ");
    addEntry({
      type: `Symptoms: ${symptomList}`,
      category: "symptoms",
      date,
      time,
      value: `${symptomList} (${severity})`,
      icon: "symptoms",
    });

    onClose();
  };

  const labelColor = highContrastMode ? "#fff" : "#101828";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            highContrastMode
              ? { backgroundColor: "#1a1a1a", borderColor: "#FFFF00", borderWidth: 2 }
              : { backgroundColor: "#fff" },
          ]}
        >
          <Text style={[styles.title, { color: labelColor }]}>Log Symptoms</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 8 }} style={{ maxHeight: "80%" }}>
            <Text style={[styles.label, { color: labelColor }]}>Select symptoms</Text>

            <View style={styles.grid}>
              {symptomOptions.map((symptom) => {
                const selected = selectedSymptoms.includes(symptom);
                return (
                  <Pressable
                    key={symptom}
                    onPress={() => toggleSymptom(symptom)}
                    style={[
                      styles.symptomBtn,
                      selected
                        ? highContrastMode
                          ? { backgroundColor: "#FFFF00" }
                          : { backgroundColor: "#155DFC" }
                        : highContrastMode
                          ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                          : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB", borderWidth: 1 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        textAlign: "center",
                        color: selected
                          ? highContrastMode
                            ? "#000"
                            : "#fff"
                          : highContrastMode
                            ? "#fff"
                            : "#101828",
                      }}
                    >
                      {symptom}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]}>Severity</Text>
            <View style={styles.severityRow}>
              {severities.map((s) => {
                const selected = severity === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSeverity(s)}
                    style={[
                      styles.severityBtn,
                      selected
                        ? highContrastMode
                          ? { backgroundColor: "#FFFF00" }
                          : { backgroundColor: "#155DFC" }
                        : highContrastMode
                          ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                          : { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", borderWidth: 1 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "800",
                        color: selected
                          ? highContrastMode
                            ? "#000"
                            : "#fff"
                          : highContrastMode
                            ? "#fff"
                            : "#101828",
                      }}
                    >
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]}>Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
            />

            <Text style={[styles.label, { color: labelColor, marginTop: 12 }]}>Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              style={[
                styles.input,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#101828" },
              ]}
            />
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={[
                styles.actionBtn,
                highContrastMode
                  ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 1 }
                  : { backgroundColor: "#F3F4F6" },
              ]}
            >
              <Text style={{ fontWeight: "800", color: highContrastMode ? "#fff" : "#101828" }}>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomBtn: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  severityRow: {
    flexDirection: "row",
    gap: 8,
  },
  severityBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
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
