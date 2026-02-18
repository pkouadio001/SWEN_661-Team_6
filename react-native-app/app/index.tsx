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

export default function Index() {
  const { highContrastMode } = useTheme();

  const [username, setUsername] = useState("JDoe");
  const [pin, setPin] = useState(["1", "1", "1", "1", "1", "1"]);
  const [loginError, setLoginError] = useState("");

  const pinRefs = useRef<Array<TextInput | null>>([]);

  const handleLogin = async () => {
    setLoginError("");

    const pinStr = pin.join("");

    if (!username.trim()) {
      setLoginError("Username is required.");
      return;
    }

    if (pinStr.length < 6 || pin.some((d) => d === "")) {
      setLoginError("Please enter your 6-digit PIN.");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/dashboard");
    } catch (error) {
      setLoginError("Invalid PIN. Please try again or reset your PIN.");
      console.error("Login error:", error);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 5) {
        pinRefs.current[index + 1]?.focus();
      }
    }
  };

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000000",
          card: "#1a1a1a",
          text: "#ffffff",
          subText: "#dddddd",
          accent: "#FFFF00",
          inputBg: "#2a2a2a",
          inputBorder: "#FFFF00",
          link: "#FFFF00",
          errorBg: "#2a2a2a",
        }
      : {
          bg: "#f0f9fc",
          card: "#ffffff",
          text: "#101828",
          subText: "#6B7280",
          accent: "#155DFC",
          inputBg: "#F9FAFB",
          inputBorder: "#E5E7EB",
          link: "#155DFC",
          errorBg: "#FEE2E2",
        };
  }, [highContrastMode]);

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
        {/* Header */}
        <View 
          style={styles.header}
          accessible={false}
        >
          <View
            style={[
              styles.logo,
              {
                backgroundColor: highContrastMode ? colors.accent : "transparent",
              },
            ]}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="CareConnect logo with heart symbol"
          >
            {/* Simple icon placeholder */}
            <Text 
              style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}
              accessible={false}
            >
              ♥
            </Text>
          </View>

          <Text 
            style={[styles.title, { color: colors.text }]}
            accessible={true}
            accessibilityRole="header"
          >
            CareConnect
          </Text>
          <Text 
            style={[styles.subtitle, { color: highContrastMode ? colors.accent : colors.subText }]}
            accessible={true}
            accessibilityRole="text"
          >
            Your Healthcare Partner
          </Text>
        </View>

        {/* Auth Card */}
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
          {/* Tabs */}
<View 
  style={[styles.tabsWrap, { backgroundColor: highContrastMode ? "#2a2a2a" : "#ECECF0" }]}
  accessible={false}
>
  <View 
    style={styles.tabsRow}
    accessible={false}
  >
    <Pressable
      onPress={() => {}}
      accessible={true}
      accessibilityRole="tab"
      accessibilityLabel="Login tab"
      accessibilityState={{ selected: true }}
      style={[
        styles.tabBtn,
        { backgroundColor: highContrastMode ? colors.accent : "#fff" }, // ✅ always active on login screen
      ]}
    >
      <Text 
        style={{ color: highContrastMode ? "#000" : "#101828", fontWeight: "600" }}
        accessible={false}
      >
        Login
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.push("/register")}
      accessible={true}
      accessibilityRole="tab"
      accessibilityLabel="Register tab"
      accessibilityHint="Switch to registration form"
      accessibilityState={{ selected: false }}
      style={styles.tabBtn}
    >
      <Text 
        style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "600" }}
        accessible={false}
      >
        Register
      </Text>
    </Pressable>
  </View>
</View>


          {/* Form */}
          <View 
            style={styles.form}
            accessible={false}
          >
            <Text 
              style={[styles.formTitle, { color: colors.text }]}
              accessible={true}
              accessibilityRole="header"
            >
              Welcome Back
            </Text>
            <Text 
              style={[styles.formDesc, { color: colors.subText }]}
              accessible={true}
              accessibilityRole="text"
            >
              Enter your credentials to access your account
            </Text>

            {/* Username */}
            <Text 
              style={[styles.label, { color: colors.text }]}
              accessible={true}
              accessibilityRole="text"
            >
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
              accessible={true}
              accessibilityLabel="Username"
              accessibilityHint="Enter your username"
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
            />

            {/* PIN */}
            <Text 
              style={[styles.label, { color: colors.text, marginTop: 16 }]}
              accessible={true}
              accessibilityRole="text"
            >
              PIN Number
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
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.text,
                    },
                  ]}
                  textAlign="center"
                />
              ))}
            </View>

            <Text 
              style={{ fontSize: 12, textAlign: "center", color: highContrastMode ? colors.accent : "#9CA3AF" }}
              accessible={true}
              accessibilityRole="text"
            >
              Enter your 6-digit PIN
            </Text>

            {/* Error */}
            {loginError ? (
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
                  {loginError}
                </Text>
              </View>
            ) : null}

            {/* Submit */}
            <Pressable
              onPress={handleLogin}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Login"
              accessibilityHint="Submit credentials to log into your account"
              style={[
                styles.primaryBtn,
                { backgroundColor: highContrastMode ? colors.accent : "#155DFC" },
              ]}
            >
              <Text 
                style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "700" }}
                accessible={false}
              >
                Login
              </Text>
            </Pressable>

            {/* Links */}
            <View 
              style={styles.links}
              accessible={false}
            >
              <Pressable 
                onPress={() => router.push("/forgot-username")}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Forgot username"
                accessibilityHint="Navigate to username recovery page"
              >
                <Text 
                  style={{ color: colors.link }}
                  accessible={false}
                >
                  Forgot username?
                </Text>
              </Pressable>
              <Pressable 
                onPress={() => router.push("/forgot-pin")}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Forgot PIN"
                accessibilityHint="Navigate to PIN recovery page"
              >
                <Text 
                  style={{ color: colors.link }}
                  accessible={false}
                >
                  Forgot your PIN?
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text 
          style={{ marginTop: 18, fontSize: 12, textAlign: "center", color: highContrastMode ? colors.accent : "#6B7280" }}
          accessible={true}
          accessibilityRole="text"
        >
          © 2026 CareConnect. All rights reserved.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  container: { width: "100%", maxWidth: 448, alignSelf: "center" },

  header: { alignItems: "center", marginBottom: 24 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#155DFC",
  },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 14 },

  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  tabsWrap: { padding: 4 },
  tabsRow: { flexDirection: "row", gap: 4 },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },

  form: { padding: 20 },
  formTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  formDesc: { fontSize: 14, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  pinRow: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 8 },
  pinBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },

  errorBox: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },

  primaryBtn: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  links: { marginTop: 16, alignItems: "center", gap: 10 },
});
