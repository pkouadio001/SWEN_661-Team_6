// app/notification-settings.tsx (or wherever this screen lives)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

type VibrationLevel = "off" | "low" | "medium" | "high";
type NotificationSettings = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  normalVibration: VibrationLevel;
  urgentVibration: VibrationLevel;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
};

const STORAGE_KEY = "notificationSettings_v1";

const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  normalVibration: "medium",
  urgentVibration: "high",
  quietHoursEnabled: false,
  quietStart: "22:00",
  quietEnd: "07:00",
};

export default function NotificationSettingsScreen() {
  const { highContrastMode } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(DEFAULT_SETTINGS.pushEnabled);
  const [emailEnabled, setEmailEnabled] = useState(DEFAULT_SETTINGS.emailEnabled);
  const [normalVibration, setNormalVibration] = useState<VibrationLevel>(
    DEFAULT_SETTINGS.normalVibration
  );
  const [urgentVibration, setUrgentVibration] = useState<VibrationLevel>(
    DEFAULT_SETTINGS.urgentVibration
  );
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(
    DEFAULT_SETTINGS.quietHoursEnabled
  );
  const [quietStart, setQuietStart] = useState(DEFAULT_SETTINGS.quietStart);
  const [quietEnd, setQuietEnd] = useState(DEFAULT_SETTINGS.quietEnd);

  const colors = useMemo(() => {
    return highContrastMode
      ? {
          bg: "#000000",
          headerBg: "#000000",
          card: "#111111",
          block: "#1A1A1A",
          border: "#FFFF00",
          title: "#FFFFFF",
          sub: "#FFFF00",
          accent: "#FFFF00",
          danger: "#FF3B30",
          teal: "#00FFFF",
          inputBg: "#1A1A1A",
          navBg: "#000000",
          muted: "#888888",
          inactive: "#FFFFFF",
        }
      : {
          bg: "#F6F9FF",
          headerBg: "#FFFFFF",
          card: "#FFFFFF",
          block: "#F9FAFB",
          border: "#E5E7EB",
          title: "#101828",
          sub: "#6B7280",
          accent: "#155DFC",
          danger: "#DC2626",
          teal: "#00BBA7",
          inputBg: "#FFFFFF",
          navBg: "#FFFFFF",
          muted: "#9CA3AF",
          inactive: "#6B7280",
        };
  }, [highContrastMode]);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as Partial<NotificationSettings>;

      setPushEnabled(parsed.pushEnabled ?? DEFAULT_SETTINGS.pushEnabled);
      setEmailEnabled(parsed.emailEnabled ?? DEFAULT_SETTINGS.emailEnabled);
      setNormalVibration(parsed.normalVibration ?? DEFAULT_SETTINGS.normalVibration);
      setUrgentVibration(parsed.urgentVibration ?? DEFAULT_SETTINGS.urgentVibration);
      setQuietHoursEnabled(parsed.quietHoursEnabled ?? DEFAULT_SETTINGS.quietHoursEnabled);
      setQuietStart(parsed.quietStart ?? DEFAULT_SETTINGS.quietStart);
      setQuietEnd(parsed.quietEnd ?? DEFAULT_SETTINGS.quietEnd);
    } catch (e) {
      console.warn("Error loading notification settings:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  const handleSaveSettings = async () => {
    const settings: NotificationSettings = {
      pushEnabled,
      emailEnabled,
      normalVibration,
      urgentVibration,
      quietHoursEnabled,
      quietStart,
      quietEnd,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      router.push("/alerts");
    } catch (e) {
      console.warn("Error saving notification settings:", e);
    }
  };

  const SwitchHC = ({
    value,
    onValueChange,
    onColor,
  }: {
    value: boolean;
    onValueChange: (v: boolean) => void;
    onColor: string;
  }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: highContrastMode ? "#333333" : "#E5E7EB",
        true: onColor,
      }}
      thumbColor={
        highContrastMode ? (value ? "#000000" : "#FFFFFF") : "#FFFFFF"
      }
    />
  );

  const VibrationPicker = ({
    label,
    value,
    onChange,
    variant,
  }: {
    label: string;
    value: VibrationLevel;
    onChange: (v: VibrationLevel) => void;
    variant: "normal" | "urgent";
  }) => {
    const selectedBg =
      variant === "urgent" ? colors.danger : colors.accent;

    const selectedText =
      variant === "urgent" ? "#FFFFFF" : highContrastMode ? "#000000" : "#FFFFFF";

    const unselectedBg = highContrastMode ? colors.block : "#FFFFFF";
    const unselectedBorder = colors.border;
    const unselectedText = colors.title;

    const wrapBg = highContrastMode
      ? colors.block
      : variant === "urgent"
      ? "#FEF2F2"
      : "#EFF6FF";

    const wrapBorder = highContrastMode
      ? colors.border
      : variant === "urgent"
      ? "#FECACA"
      : "#BFDBFE";

    return (
      <View style={[styles.block, { backgroundColor: wrapBg, borderColor: wrapBorder }]}>
        <Text style={[styles.blockTitle, { color: colors.title }]}>{label}</Text>

        <View style={styles.pillRow}>
          {(["off", "low", "medium", "high"] as const).map((level) => {
            const selected = value === level;
            return (
              <Pressable
                key={level}
                onPress={() => onChange(level)}
                style={({ pressed }) => [
                  styles.pill,
                  {
                    backgroundColor: selected ? selectedBg : unselectedBg,
                    borderColor: selected ? selectedBg : unselectedBorder,
                  },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text
                  style={{
                    fontWeight: "900",
                    textTransform: "capitalize",
                    color: selected ? selectedText : unselectedText,
                  }}
                >
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.headerBg,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerIconWrap}>
            <View
              style={[
                styles.headerIcon,
                { backgroundColor: highContrastMode ? colors.accent : colors.danger },
              ]}
            >
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900", fontSize: 18 }}>
                ⚙️
              </Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/alerts")} style={styles.backBtn}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: colors.accent }}>←</Text>
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Notification Settings</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>
                Customize your notification preferences
              </Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Main */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back Button Card */}
          <Pressable
            onPress={() => router.push("/alerts")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: colors.accent }}>← Back to Notifications</Text>
          </Pressable>

          {/* Notification Channels */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>Notification Channels</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Choose how you want to receive notifications
            </Text>

            <View style={[styles.rowCard, { backgroundColor: colors.block, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: colors.title }}>Push Notifications</Text>
                <Text style={{ marginTop: 2, fontWeight: "800", color: colors.sub }}>
                  Receive alerts on this device
                </Text>
              </View>

              <SwitchHC value={pushEnabled} onValueChange={setPushEnabled} onColor={colors.accent} />
            </View>

            <View style={[styles.rowCard, { backgroundColor: colors.block, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: colors.title }}>Email Notifications</Text>
                <Text style={{ marginTop: 2, fontWeight: "800", color: colors.sub }}>
                  Receive reminders via email
                </Text>
              </View>

              <SwitchHC value={emailEnabled} onValueChange={setEmailEnabled} onColor={colors.teal} />
            </View>
          </View>

          {/* Vibration Settings */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>Vibration Settings</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Adjust vibration intensity for different priorities
            </Text>

            <VibrationPicker
              label="Normal Priority Vibration"
              value={normalVibration}
              onChange={setNormalVibration}
              variant="normal"
            />

            <VibrationPicker
              label="Urgent Priority Vibration"
              value={urgentVibration}
              onChange={setUrgentVibration}
              variant="urgent"
            />
          </View>

          {/* Quiet Hours */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.title }]}>Quiet Hours</Text>
                <Text style={[styles.sectionSub, { color: colors.sub }]}>
                  Silence notifications during specific times
                </Text>
              </View>

              <SwitchHC
                value={quietHoursEnabled}
                onValueChange={setQuietHoursEnabled}
                onColor={colors.accent}
              />
            </View>

            {quietHoursEnabled && (
              <View style={{ gap: 12, marginTop: 10 }}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: colors.title }]}>Start Time</Text>
                    <TextInput
                      value={quietStart}
                      onChangeText={setQuietStart}
                      placeholder="22:00"
                      placeholderTextColor={colors.muted}
                      style={[
                        styles.input,
                        { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.title },
                      ]}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: colors.title }]}>End Time</Text>
                    <TextInput
                      value={quietEnd}
                      onChangeText={setQuietEnd}
                      placeholder="07:00"
                      placeholderTextColor={colors.muted}
                      style={[
                        styles.input,
                        { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.title },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.warning,
                    {
                      backgroundColor: highContrastMode ? colors.block : "#FEF2F2",
                      borderColor: highContrastMode ? colors.border : "#FECACA",
                    },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? "#FFFFFF" : colors.danger }}>
                    Urgent priority vibrations will bypass quiet hours
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Save */}
          <Pressable
            onPress={handleSaveSettings}
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff", fontSize: 16 }}>
              Save Settings
            </Text>
          </Pressable>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.nav, { backgroundColor: colors.navBg, borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Link href="/dashboard" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.inactive, fontWeight: "800" }}>Home</Text>
              </Pressable>
            </Link>

            <Link href="/tasks" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.inactive, fontWeight: "800" }}>Tasks</Text>
              </Pressable>
            </Link>

            <Link href="/health" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.inactive, fontWeight: "800" }}>Health</Text>
              </Pressable>
            </Link>

            <Link href="/communication" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.inactive, fontWeight: "800" }}>Messages</Text>
              </Pressable>
            </Link>

            <Link href="/alerts" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: colors.accent, fontWeight: "900" }}>Alerts</Text>
              </Pressable>
            </Link>

            <Link href="/profile" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.inactive, fontWeight: "800" }}>Profile</Text>
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

  sectionTitle: { fontSize: 16, fontWeight: "900" },
  sectionSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  block: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
  blockTitle: { fontSize: 14, fontWeight: "900" },

  pillRow: { flexDirection: "row", gap: 8 },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },

  label: { fontSize: 13, fontWeight: "900", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "800",
  },

  warning: { borderWidth: 1, borderRadius: 12, padding: 12 },

  saveBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
