<<<<<<< HEAD
import { useTheme } from "@/context/ThemeContext";
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

export default function ForgotUsernameScreen() {
  const { highContrastMode } = useTheme();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000",
          card: "#1a1a1a",
          text: "#fff",
          subText: "#FFFF00",
          accent: "#FFFF00",
          inputBg: "#2a2a2a",
          inputBorder: "#FFFF00",
          error: "#FF4D4D",
        }
      : {
          bg: "#F6F9FF",
          card: "#fff",
          text: "#101828",
          subText: "#6B7280",
          accent: "#155DFC",
          inputBg: "#F9FAFB",
          inputBorder: "#E5E7EB",
          error: "#DC2626",
        };
  }, [highContrastMode]);

  const handleSendLink = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessage("A username recovery link has been sent to your email.");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Forgot Username
        </Text>

        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Enter your email address and we will send you a link to recover your username.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
        />

        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

        {message ? (
          <Text style={[styles.successText, { color: colors.accent }]}>
            {message}
          </Text>
        ) : null}

        <Pressable
          onPress={handleSendLink}
          style={[
            styles.primaryBtn,
            { backgroundColor: highContrastMode ? colors.accent : "#155DFC" },
          ]}
        >
          <Text
            style={{
              color: highContrastMode ? "#000" : "#fff",
              fontWeight: "700",
            }}
          >
            Send Recovery Link
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: colors.accent, fontWeight: "700" }}>
            Back to Login
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  container: { maxWidth: 400, alignSelf: "center", width: "100%" },

  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 20 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  primaryBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  errorText: { marginTop: 10, fontSize: 13 },
  successText: { marginTop: 10, fontSize: 13, fontWeight: "600" },
});
=======
import { useTheme } from "@/context/ThemeContext";
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

export default function ForgotUsernameScreen() {
  const { highContrastMode } = useTheme();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000",
          card: "#1a1a1a",
          text: "#fff",
          subText: "#FFFF00",
          accent: "#FFFF00",
          inputBg: "#2a2a2a",
          inputBorder: "#FFFF00",
          error: "#FF4D4D",
        }
      : {
          bg: "#F6F9FF",
          card: "#fff",
          text: "#101828",
          subText: "#6B7280",
          accent: "#155DFC",
          inputBg: "#F9FAFB",
          inputBorder: "#E5E7EB",
          error: "#DC2626",
        };
  }, [highContrastMode]);

  const handleSendLink = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessage("A username recovery link has been sent to your email.");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Forgot Username
        </Text>

        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Enter your email address and we will send you a link to recover your username.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
        />

        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

        {message ? (
          <Text style={[styles.successText, { color: colors.accent }]}>
            {message}
          </Text>
        ) : null}

        <Pressable
          onPress={handleSendLink}
          style={[
            styles.primaryBtn,
            { backgroundColor: highContrastMode ? colors.accent : "#155DFC" },
          ]}
        >
          <Text
            style={{
              color: highContrastMode ? "#000" : "#fff",
              fontWeight: "700",
            }}
          >
            Send Recovery Link
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: colors.accent, fontWeight: "700" }}>
            Back to Login
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  container: { maxWidth: 400, alignSelf: "center", width: "100%" },

  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 20 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  primaryBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  errorText: { marginTop: 10, fontSize: 13 },
  successText: { marginTop: 10, fontSize: 13, fontWeight: "600" },
});
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
