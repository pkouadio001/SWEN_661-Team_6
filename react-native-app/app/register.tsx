import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const { highContrastMode } = useTheme();

  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("jdoe@hotmail.com");
  const [username, setUsername] = useState("JDoe");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const pinRefs = useRef<Array<TextInput | null>>([]);

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000",
          card: "#1a1a1a",
          text: "#fff",
          subText: "#ddd",
          accent: "#FFFF00",
          inputBg: "#2a2a2a",
          inputBorder: "#FFFF00",
          errorBg: "#2a2a2a",
        }
      : {
          bg: "#f0f9fc",
          card: "#fff",
          text: "#101828",
          subText: "#6B7280",
          accent: "#155DFC",
          inputBg: "#F9FAFB",
          inputBorder: "#E5E7EB",
          errorBg: "#FEE2E2",
        };
  }, [highContrastMode]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value !== "" && !/^\d$/.test(value)) return;

    setPin((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < 5) pinRefs.current[index + 1]?.focus();
  };

  const handleRegister = async () => {
    setError("");
    const pinStr = pin.join("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!username.trim()) return setError("Username is required.");
    if (pinStr.length !== 6 || pin.some((d) => d === "")) return setError("Enter a 6-digit PIN.");

    await new Promise((r) => setTimeout(r, 400));
    router.replace("/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      accessible={false}
    >
      <View 
        style={styles.container}
        accessible={false}
      >
        <View 
          style={styles.headerRow}
          accessible={false}
        >
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to previous screen"
          >
            <Text 
              style={{ fontSize: 18, fontWeight: "900", color: colors.accent }}
              accessible={false}
            >
              ←
            </Text>
          </Pressable>
          <Text 
            style={[styles.headerTitle, { color: colors.text }]}
            accessible={true}
            accessibilityRole="header"
          >
            Register
          </Text>
          <View 
            style={{ width: 40 }}
            accessible={false}
          />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: highContrastMode ? colors.accent : "#E5E7EB",
              borderWidth: highContrastMode ? 2 : 1,
            },
          ]}
          accessible={false}
        >
          <Text 
            style={[styles.formTitle, { color: colors.text }]}
            accessible={true}
            accessibilityRole="header"
          >
            Create Account
          </Text>
          <Text 
            style={[styles.formDesc, { color: colors.subText }]}
            accessible={true}
            accessibilityRole="text"
          >
            Fill in your details to get started
          </Text>

          <Text 
            style={[styles.label, { color: colors.text }]}
            accessible={true}
            accessibilityRole="text"
          >
            Full Name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
            accessible={true}
            accessibilityLabel="Full Name"
            accessibilityHint="Enter your full name"
            style={[
              styles.input,
              { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
            ]}
          />

          <Text 
            style={[styles.label, { color: colors.text, marginTop: 12 }]}
            accessible={true}
            accessibilityRole="text"
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
            accessible={true}
            accessibilityLabel="Email"
            accessibilityHint="Enter your email address"
            style={[
              styles.input,
              { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
            ]}
          />

          <Text 
            style={[styles.label, { color: colors.text, marginTop: 12 }]}
            accessible={true}
            accessibilityRole="text"
          >
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Username"
            placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
            accessible={true}
            accessibilityLabel="Username"
            accessibilityHint="Enter your desired username"
            style={[
              styles.input,
              { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
            ]}
          />

          <Text 
            style={[styles.label, { color: colors.text, marginTop: 14 }]}
            accessible={true}
            accessibilityRole="text"
          >
            Create PIN
          </Text>
          <View 
            style={styles.pinRow}
            accessible={false}
          >
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={(r) => (pinRefs.current[index] = r)}
                value={digit}
                onChangeText={(v) => handlePinChange(index, v)}
                keyboardType="number-pad"
                maxLength={1}
                accessible={true}
                accessibilityLabel={`PIN digit ${index + 1}`}
                accessibilityHint={`Enter digit ${index + 1} of 6`}
                style={[
                  styles.pinBox,
                  { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
                ]}
                textAlign="center"
              />
            ))}
          </View>

          {error ? (
            <View 
              style={[styles.errorBox, { backgroundColor: colors.errorBg, borderColor: colors.inputBorder }]}
              accessible={true}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text 
                style={{ color: highContrastMode ? colors.accent : "#DC2626" }}
                accessible={true}
                accessibilityRole="text"
              >
                {error}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleRegister}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Register"
            accessibilityHint="Submit registration form to create your account"
            style={[styles.primaryBtn, { backgroundColor: highContrastMode ? colors.accent : "#155DFC" }]}
          >
            <Text 
              style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "800" }}
              accessible={false}
            >
              Register
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => router.replace("/")} 
            style={{ marginTop: 12, alignItems: "center" }}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Login"
            accessibilityHint="Navigate to login screen"
          >
            <Text 
              style={{ color: colors.accent, fontWeight: "700" }}
              accessible={false}
            >
              Already have an account? Login
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  container: { width: "100%", maxWidth: 448, alignSelf: "center" },

  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "900" },

  card: { borderRadius: 16, padding: 18 },
  formTitle: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  formDesc: { fontSize: 14, marginBottom: 14 },

  label: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },

  pinRow: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 8 },
  pinBox: { width: 36, height: 36, borderWidth: 1, borderRadius: 8, fontSize: 14 },

  errorBox: { marginTop: 12, borderWidth: 1, borderRadius: 10, padding: 12 },
  primaryBtn: { marginTop: 14, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
});
