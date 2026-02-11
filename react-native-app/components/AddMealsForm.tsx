import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useHealthLogs } from "@/context/HealthLogsContext";
import { useTheme } from "@/context/ThemeContext";

interface AddMealsFormProps {
  onClose: () => void;
  visible: boolean;
}

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

function formatDateUS(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeUS(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AddMealsForm({ onClose, visible }: AddMealsFormProps) {
  const { addEntry } = useHealthLogs();
  const { highContrastMode } = useTheme();

  const now = useMemo(() => new Date(), []);
  const [mealType, setMealType] =
    useState<(typeof mealTypes)[number]>("Breakfast");
  const [mealDescription, setMealDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(formatDateUS(now));
  const [time, setTime] = useState(formatTimeUS(now));
  const [showMealTypeMenu, setShowMealTypeMenu] = useState(false);

  const handleSubmit = () => {
    if (!mealDescription.trim()) return;

    const calorieInfo = calories ? ` (${calories} cal)` : "";

    addEntry({
      type: `${mealType}: ${mealDescription}`,
      category: "meals",
      date,
      time,
      value: `${mealDescription}${calorieInfo}`,
      icon: "meals",
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.card,
            highContrastMode ? styles.cardHC : styles.cardNormal,
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                styles.title,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              Log Meal
            </Text>

            <Text
              style={[
                styles.label,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              Meal Type
            </Text>

            <Pressable
              onPress={() => setShowMealTypeMenu((v) => !v)}
              style={[
                styles.input,
                highContrastMode ? styles.inputHC : styles.inputNormal,
              ]}
            >
              <Text
                style={[
                  styles.inputText,
                  highContrastMode ? styles.textHC : styles.textNormal,
                ]}
              >
                {mealType}
              </Text>
            </Pressable>

            {showMealTypeMenu && (
              <View
                style={[
                  styles.menu,
                  highContrastMode ? styles.menuHC : styles.menuNormal,
                ]}
              >
                {mealTypes.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setMealType(type);
                      setShowMealTypeMenu(false);
                    }}
                    style={styles.menuItem}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        highContrastMode ? styles.textHC : styles.textNormal,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text
              style={[
                styles.label,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              What did you eat?
            </Text>
            <TextInput
              value={mealDescription}
              onChangeText={setMealDescription}
              placeholder="Describe your meal..."
              placeholderTextColor={highContrastMode ? "#666666" : "#9CA3AF"}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                highContrastMode ? styles.inputHC : styles.inputNormal,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            />

            <Text
              style={[
                styles.label,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              Calories (optional)
            </Text>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="0"
              placeholderTextColor={highContrastMode ? "#666666" : "#9CA3AF"}
              keyboardType="numeric"
              style={[
                styles.input,
                highContrastMode ? styles.inputHC : styles.inputNormal,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            />

            <Text
              style={[
                styles.label,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              Date
            </Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={[
                styles.input,
                highContrastMode ? styles.inputHC : styles.inputNormal,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            />

            <Text
              style={[
                styles.label,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            >
              Time
            </Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              style={[
                styles.input,
                highContrastMode ? styles.inputHC : styles.inputNormal,
                highContrastMode ? styles.textHC : styles.textNormal,
              ]}
            />

            <View style={styles.buttonRow}>
              <Pressable
                onPress={onClose}
                style={[
                  styles.button,
                  highContrastMode ? styles.cancelHC : styles.cancelNormal,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    highContrastMode ? styles.textHC : styles.textNormal,
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                style={[
                  styles.button,
                  highContrastMode ? styles.addHC : styles.addNormal,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    highContrastMode ? styles.addTextHC : styles.addTextNormal,
                  ]}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: { borderRadius: 24, padding: 18, maxWidth: 420, width: "100%", alignSelf: "center" },
  cardNormal: { backgroundColor: "#FFFFFF" },
  cardHC: { backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#FFFF00" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 10 },
  input: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  inputNormal: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" },
  inputHC: { backgroundColor: "#2a2a2a", borderColor: "#FFFF00" },
  inputText: { fontSize: 15 },
  textArea: { minHeight: 90, textAlignVertical: "top" },
  textNormal: { color: "#101828" },
  textHC: { color: "#FFFFFF" },
  menu: { marginTop: 8, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  menuNormal: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" },
  menuHC: { backgroundColor: "#2a2a2a", borderColor: "#FFFF00" },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14 },
  menuItemText: { fontSize: 15, fontWeight: "600" },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 18, paddingTop: 6 },
  button: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 15, fontWeight: "700" },
  cancelNormal: { backgroundColor: "#F9FAFB" },
  cancelHC: { backgroundColor: "#2a2a2a", borderWidth: 1, borderColor: "#FFFF00" },
  addNormal: { backgroundColor: "#155DFC" },
  addHC: { backgroundColor: "#FFFF00" },
  addTextNormal: { color: "#FFFFFF" },
  addTextHC: { color: "#000000" },
});
