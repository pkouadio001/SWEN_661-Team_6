<<<<<<< HEAD
import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type VibrationLevel = "off" | "low" | "medium" | "high";

export default function AlertsScreen() {
  const { highContrastMode } = useTheme();

  const [normalVibration, setNormalVibration] = useState<VibrationLevel>("medium");
  const [urgentVibration, setUrgentVibration] = useState<VibrationLevel>("high");

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    headerBg: highContrastMode ? "#000000" : "#FFFFFF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    title: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    accent: highContrastMode ? "#FFFF00" : "#155DFC",
    danger: "#DC2626",
    mutedCard: highContrastMode ? "#2a2a2a" : "#F9FAFB",
  };

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("notificationSettings");
      if (!saved) return;

      const settings = JSON.parse(saved);
      setNormalVibration(settings.normalVibration ?? "medium");
      setUrgentVibration(settings.urgentVibration ?? "high");
    } catch (e) {
      console.warn("Error loading notification settings:", e);
    }
  }, []);

  // RN equivalent of "window focus": reload whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerIconWrap}>
            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? "#FFFF00" : colors.danger }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900", fontSize: 18 }}>
                🔔
              </Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.backBtn}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
                ←
              </Text>
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Notifications & Reminders</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Stay on track with your care</Text>
            </View>

            {/* spacer (web had hidden right button) */}
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Main */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Dashboard - "Sticky" alternative */}
          <Pressable
            onPress={() => router.push("/dashboard")}
            style={({ pressed }) => [
              styles.backCard,
              {
                backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                borderColor: colors.border,
              },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
              ← Back to Dashboard
            </Text>
          </Pressable>

          {/* Notification Settings Section */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.title }]}>Notification Settings</Text>
            </View>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Customize how you receive reminders
            </Text>

            {/* Push Notifications */}
            <View style={[styles.rowCard, { backgroundColor: colors.mutedCard, borderColor: colors.border }]}>
              <Text style={{ fontWeight: "900", color: colors.title }}>Push Notifications</Text>

              <Pressable
                onPress={() => router.push("/notification-settings")}
                style={({ pressed }) => [
                  styles.configureBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ color: colors.accent, fontWeight: "900" }}>Configure</Text>
              </Pressable>
            </View>

            {/* Normal Priority Vibration */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF",
                  borderColor: highContrastMode ? colors.border : "#BFDBFE",
                },
              ]}
            >
              <Text style={{ fontWeight: "900", color: colors.title }}>
                Normal Priority Vibration
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? colors.accent : colors.accent }}>
                Current: <Text style={{ textTransform: "capitalize" }}>{normalVibration}</Text>
              </Text>
            </View>

            {/* Urgent Priority Vibration */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: highContrastMode ? "#2a2a2a" : "#FEF2F2",
                  borderColor: highContrastMode ? colors.border : "#FECACA",
                },
              ]}
            >
              <Text style={{ fontWeight: "900", color: colors.title }}>
                Urgent Priority Vibration
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? colors.title : colors.danger }}>
                Current: <Text style={{ textTransform: "capitalize" }}>{urgentVibration}</Text>
              </Text>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation (RN) */}
        <View style={[styles.nav, { backgroundColor: highContrastMode ? "#000" : "#fff", borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Link href="/dashboard" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
              </Pressable>
            </Link>

            <Link href="/tasks" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
              </Pressable>
            </Link>

            <Link href="/health" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Health</Text>
              </Pressable>
            </Link>

            <Link href="/communication" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Messages</Text>
              </Pressable>
            </Link>

            <Link href="/alerts" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? colors.accent : "#155DFC", fontWeight: "900" }}>Alerts</Text>
              </Pressable>
            </Link>

            <Link href="/profile" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  headerIconWrap: { alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  headerTitle: { fontSize: 18, fontWeight: "900" },
  headerSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  content: { padding: 16, gap: 12 },

  backCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "900" },
  sectionSub: { fontSize: 13, fontWeight: "800" },

  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  configureBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },

  infoCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
=======
import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type VibrationLevel = "off" | "low" | "medium" | "high";

export default function AlertsScreen() {
  const { highContrastMode } = useTheme();

  const [normalVibration, setNormalVibration] = useState<VibrationLevel>("medium");
  const [urgentVibration, setUrgentVibration] = useState<VibrationLevel>("high");

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    headerBg: highContrastMode ? "#000000" : "#FFFFFF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    title: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    accent: highContrastMode ? "#FFFF00" : "#155DFC",
    danger: "#DC2626",
    mutedCard: highContrastMode ? "#2a2a2a" : "#F9FAFB",
  };

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("notificationSettings");
      if (!saved) return;

      const settings = JSON.parse(saved);
      setNormalVibration(settings.normalVibration ?? "medium");
      setUrgentVibration(settings.urgentVibration ?? "high");
    } catch (e) {
      console.warn("Error loading notification settings:", e);
    }
  }, []);

  // RN equivalent of "window focus": reload whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerIconWrap}>
            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? "#FFFF00" : colors.danger }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900", fontSize: 18 }}>
                🔔
              </Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.backBtn}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
                ←
              </Text>
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Notifications & Reminders</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Stay on track with your care</Text>
            </View>

            {/* spacer (web had hidden right button) */}
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Main */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Dashboard - "Sticky" alternative */}
          <Pressable
            onPress={() => router.push("/dashboard")}
            style={({ pressed }) => [
              styles.backCard,
              {
                backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                borderColor: colors.border,
              },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
              ← Back to Dashboard
            </Text>
          </Pressable>

          {/* Notification Settings Section */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.title }]}>Notification Settings</Text>
            </View>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Customize how you receive reminders
            </Text>

            {/* Push Notifications */}
            <View style={[styles.rowCard, { backgroundColor: colors.mutedCard, borderColor: colors.border }]}>
              <Text style={{ fontWeight: "900", color: colors.title }}>Push Notifications</Text>

              <Pressable
                onPress={() => router.push("/notification-settings")}
                style={({ pressed }) => [
                  styles.configureBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ color: colors.accent, fontWeight: "900" }}>Configure</Text>
              </Pressable>
            </View>

            {/* Normal Priority Vibration */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF",
                  borderColor: highContrastMode ? colors.border : "#BFDBFE",
                },
              ]}
            >
              <Text style={{ fontWeight: "900", color: colors.title }}>
                Normal Priority Vibration
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? colors.accent : colors.accent }}>
                Current: <Text style={{ textTransform: "capitalize" }}>{normalVibration}</Text>
              </Text>
            </View>

            {/* Urgent Priority Vibration */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: highContrastMode ? "#2a2a2a" : "#FEF2F2",
                  borderColor: highContrastMode ? colors.border : "#FECACA",
                },
              ]}
            >
              <Text style={{ fontWeight: "900", color: colors.title }}>
                Urgent Priority Vibration
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? colors.title : colors.danger }}>
                Current: <Text style={{ textTransform: "capitalize" }}>{urgentVibration}</Text>
              </Text>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation (RN) */}
        <View style={[styles.nav, { backgroundColor: highContrastMode ? "#000" : "#fff", borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Link href="/dashboard" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
              </Pressable>
            </Link>

            <Link href="/tasks" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
              </Pressable>
            </Link>

            <Link href="/health" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Health</Text>
              </Pressable>
            </Link>

            <Link href="/communication" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Messages</Text>
              </Pressable>
            </Link>

            <Link href="/alerts" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? colors.accent : "#155DFC", fontWeight: "900" }}>Alerts</Text>
              </Pressable>
            </Link>

            <Link href="/profile" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  headerIconWrap: { alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  headerTitle: { fontSize: 18, fontWeight: "900" },
  headerSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  content: { padding: 16, gap: 12 },

  backCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "900" },
  sectionSub: { fontSize: 13, fontWeight: "800" },

  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  configureBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },

  infoCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
