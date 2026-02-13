<<<<<<< HEAD
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useEmergencyContact } from "@/context/EmergencyContactContext";
import { useTheme } from "@/context/ThemeContext";

export default function EmergencySOS() {
  const router = useRouter();
  const { highContrastMode } = useTheme();
  const { emergencyContactData } = useEmergencyContact();

  const callNumber = async (raw: string) => {
    const phone = String(raw).replace(/[^\d+]/g, ""); // remove spaces/dashes/etc.
    const url = `tel:${phone}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Unable to place call", `Your device can't open: ${url}`);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.warn(e);
      Alert.alert("Call failed", "Please try again.");
    }
  };

  const handleCancel = () => {
    router.replace("/communication"); // or router.back()
  };

  return (
    <View style={[styles.overlay, { backgroundColor: "#000" }]}>
      <View
        style={[
          styles.card,
          highContrastMode && {
            backgroundColor: "#1a1a1a",
            borderColor: "#FFFF00",
            borderWidth: 2,
          },
        ]}
      >
        <View style={[styles.header, { backgroundColor: "#DC2626" }]}>
          <Text style={[styles.title, { color: highContrastMode ? "#FFFF00" : "#FFF" }]}>
            Emergency SOS Activated
          </Text>
          <Text style={{ color: highContrastMode ? "#FFFF00" : "rgba(255,255,255,0.9)" }}>
            Select a contact to call immediately
          </Text>
        </View>

        <View style={[styles.body, highContrastMode && { backgroundColor: "#1a1a1a" }]}>
          {/* Primary Contact */}
          <Pressable
            onPress={() => callNumber(emergencyContactData.phone)}
            style={[
              styles.option,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 2 }
                : { backgroundColor: "#EFF6FF", borderColor: "#155DFC", borderWidth: 2 },
            ]}
          >
            <Text style={[styles.optionTitle, { color: highContrastMode ? "#FFFF00" : "#101828" }]}>
              {emergencyContactData.name}
            </Text>
            <Text style={{ color: highContrastMode ? "#FFF" : "#6B7280" }}>
              {emergencyContactData.phone}
            </Text>
          </Pressable>

          {/* Emergency 911 (US) */}
          <Pressable
            onPress={() => callNumber("911")}
            style={[
              styles.option,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#DC2626", borderWidth: 2 }
                : { backgroundColor: "#FEF2F2", borderColor: "#DC2626", borderWidth: 2 },
            ]}
          >
            <Text style={[styles.optionTitle, { color: highContrastMode ? "#FFFF00" : "#101828" }]}>
              Emergency: 911
            </Text>
            <Text style={{ color: highContrastMode ? "#FFF" : "#6B7280" }}>
              Police / Fire / EMS
            </Text>
          </Pressable>

          {/* Cancel */}
          <Pressable
            onPress={handleCancel}
            style={[
              styles.cancel,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 2 }
                : { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderWidth: 2 },
            ]}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: highContrastMode ? "#FFFF00" : "#101828" }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
  card: { width: "100%", maxWidth: 420, borderRadius: 24, overflow: "hidden", backgroundColor: "#FFF" },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  body: { padding: 16, gap: 12, backgroundColor: "#FFF" },
  option: { borderRadius: 16, padding: 16 },
  optionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  cancel: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
});
=======
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useEmergencyContact } from "@/context/EmergencyContactContext";
import { useTheme } from "@/context/ThemeContext";

export default function EmergencySOS() {
  const router = useRouter();
  const { highContrastMode } = useTheme();
  const { emergencyContactData } = useEmergencyContact();

  const callNumber = async (raw: string) => {
    const phone = String(raw).replace(/[^\d+]/g, ""); // remove spaces/dashes/etc.
    const url = `tel:${phone}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Unable to place call", `Your device can't open: ${url}`);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.warn(e);
      Alert.alert("Call failed", "Please try again.");
    }
  };

  const handleCancel = () => {
    router.replace("/communication"); // or router.back()
  };

  return (
    <View style={[styles.overlay, { backgroundColor: "#000" }]}>
      <View
        style={[
          styles.card,
          highContrastMode && {
            backgroundColor: "#1a1a1a",
            borderColor: "#FFFF00",
            borderWidth: 2,
          },
        ]}
      >
        <View style={[styles.header, { backgroundColor: "#DC2626" }]}>
          <Text style={[styles.title, { color: highContrastMode ? "#FFFF00" : "#FFF" }]}>
            Emergency SOS Activated
          </Text>
          <Text style={{ color: highContrastMode ? "#FFFF00" : "rgba(255,255,255,0.9)" }}>
            Select a contact to call immediately
          </Text>
        </View>

        <View style={[styles.body, highContrastMode && { backgroundColor: "#1a1a1a" }]}>
          {/* Primary Contact */}
          <Pressable
            onPress={() => callNumber(emergencyContactData.phone)}
            style={[
              styles.option,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 2 }
                : { backgroundColor: "#EFF6FF", borderColor: "#155DFC", borderWidth: 2 },
            ]}
          >
            <Text style={[styles.optionTitle, { color: highContrastMode ? "#FFFF00" : "#101828" }]}>
              {emergencyContactData.name}
            </Text>
            <Text style={{ color: highContrastMode ? "#FFF" : "#6B7280" }}>
              {emergencyContactData.phone}
            </Text>
          </Pressable>

          {/* Emergency 911 (US) */}
          <Pressable
            onPress={() => callNumber("911")}
            style={[
              styles.option,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#DC2626", borderWidth: 2 }
                : { backgroundColor: "#FEF2F2", borderColor: "#DC2626", borderWidth: 2 },
            ]}
          >
            <Text style={[styles.optionTitle, { color: highContrastMode ? "#FFFF00" : "#101828" }]}>
              Emergency: 911
            </Text>
            <Text style={{ color: highContrastMode ? "#FFF" : "#6B7280" }}>
              Police / Fire / EMS
            </Text>
          </Pressable>

          {/* Cancel */}
          <Pressable
            onPress={handleCancel}
            style={[
              styles.cancel,
              highContrastMode
                ? { backgroundColor: "#2a2a2a", borderColor: "#FFFF00", borderWidth: 2 }
                : { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderWidth: 2 },
            ]}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: highContrastMode ? "#FFFF00" : "#101828" }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
  card: { width: "100%", maxWidth: 420, borderRadius: 24, overflow: "hidden", backgroundColor: "#FFF" },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  body: { padding: 16, gap: 12, backgroundColor: "#FFF" },
  option: { borderRadius: 16, padding: 16 },
  optionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  cancel: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
});
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
