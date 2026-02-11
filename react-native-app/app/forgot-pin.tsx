import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const RESET_EMAIL_KEY = "resetPin_email";
const RESET_CODE_KEY = "resetPin_code";
const RESET_CODE_EXP_KEY = "resetPin_code_exp"; // timestamp ms

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

export default function ForgotPinScreen() {
  const { highContrastMode } = useTheme();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000",
          card: "#1a1a1a",
          text: "#fff",
          sub: "#FFFF00",
          accent: "#FFFF00",
          inputBg: "#2a2a2a",
          border: "#FFFF00",
          error: "#FF4D4D",
        }
      : {
          bg: "#F6F9FF",
          card: "#fff",
          text: "#101828",
          sub: "#6B7280",
          accent: "#155DFC",
          inputBg: "#F9FAFB",
          border: "#E5E7EB",
          error: "#DC2626",
        };
  }, [highContrastMode]);

  const sendCode = async () => {
    setError("");
    setInfo("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return setError("Please enter your email.");
    if (!/\S+@\S+\.\S+/.test(trimmed)) return setError("Please enter a valid email.");

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    try {
      await AsyncStorage.multiSet([
        [RESET_EMAIL_KEY, trimmed],
        [RESET_CODE_KEY, code],
        [RESET_CODE_EXP_KEY, String(expiresAt)],
      ]);

      // In a real app: call your backend/email service here.
      // For your demo/testing, we show the code on screen:
      setInfo(`Demo code sent: ${code}`);

      router.push("/forgot-pin-verify");
    } catch (e) {
      console.warn(e);
      setError("Could not send reset code. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Forgot PIN</Text>
        <Text style={[styles.sub, { color: colors.sub }]}>
          Enter your email and we’ll send a 6-digit verification code.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
          ]}
        />

        {error ? <Text style={[styles.msg, { color: colors.error }]}>{error}</Text> : null}
        {info ? <Text style={[styles.msg, { color: colors.accent }]}>{info}</Text> : null}

        <Pressable
          onPress={sendCode}
          style={[styles.btn, { backgroundColor: highContrastMode ? colors.accent : colors.accent }]}
        >
          <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "800" }}>
            Send Code
          </Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/")} style={{ marginTop: 14, alignItems: "center" }}>
          <Text style={{ color: colors.accent, fontWeight: "800" }}>Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, maxWidth: 420, alignSelf: "center", width: "100%" },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 6 },
  sub: { fontSize: 13, fontWeight: "700", marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontWeight: "800" },
  msg: { marginTop: 10, fontSize: 13, fontWeight: "700" },
  btn: { marginTop: 16, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
});
