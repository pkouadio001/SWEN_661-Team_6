<<<<<<< HEAD
import AddMealsForm from "@/components/AddMealsForm";
import AddMoodForm from "@/components/AddMoodForm";
import AddSymptomsForm from "@/components/AddSymptomsForm";
import AddVitalForm from "@/components/AddVitalForm";
import { useHealthLogs } from "@/context/HealthLogsContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

type Category = "all" | "vital" | "mood" | "symptoms" | "meals";
type FormKey = "vital" | "mood" | "symptoms" | "meals" | null;

export default function HealthLogsScreen() {
  const { highContrastMode } = useTheme();
  const { allEntries, deleteEntry } = useHealthLogs();

  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showAll, setShowAll] = useState(false);

  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [longPressEntryId, setLongPressEntryId] = useState<number | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      card2: highContrastMode ? "#2a2a2a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      muted: highContrastMode ? "#CCCCCC" : "#6B7280",
      accent: highContrastMode ? "#FFFF00" : "#155DFC",
      teal: "#00BBA7",
      danger: highContrastMode ? "#FF4444" : "#EF4444",
    }),
    [highContrastMode]
  );

  // Parse "Jan 3, 2026"
  const parseDate = (dateString: string): Date => {
    const monthNames: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateString.match(/^([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})$/);
    if (!parts) return new Date(0);
    const month = monthNames[parts[1]];
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);
    return new Date(year, month, day);
  };

  const filteredEntries = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? allEntries
        : allEntries.filter((e) => e.category === selectedCategory);

    return [...base].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  }, [allEntries, selectedCategory]);

  const displayedEntries = useMemo(() => {
    return showAll ? filteredEntries : filteredEntries.slice(0, 5);
  }, [filteredEntries, showAll]);

  const clearLongPressTimers = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
    longPressTimerRef.current = null;
    longPressIntervalRef.current = null;
  };

  const handleLongPressStart = (entryId: number) => {
    setLongPressEntryId(entryId);
    setLongPressProgress(0);

    clearLongPressTimers();

    let progress = 0;
    longPressIntervalRef.current = setInterval(() => {
      progress += 1; // 1% every 100ms => 10s total
      setLongPressProgress(progress);
      if (progress >= 100 && longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current);
      }
    }, 100);

    longPressTimerRef.current = setTimeout(() => {
      clearLongPressTimers();
      setShowDeleteConfirm(entryId);
      setLongPressEntryId(null);
      setLongPressProgress(0);
    }, 10000);
  };

  const handleLongPressEnd = () => {
    clearLongPressTimers();
    setLongPressEntryId(null);
    setLongPressProgress(0);
  };

  const handleDeleteConfirm = (entryId: number) => {
    deleteEntry(entryId);
    setShowDeleteConfirm(null);
  };

  useEffect(() => {
    return () => clearLongPressTimers();
  }, []);

  const iconForCategory = (category: string) => {
    switch (category) {
      case "vital":
        return { bg: "#D1FAE5", emoji: "🫀" };
      case "mood":
        return { bg: "#FEF3C7", emoji: "🙂" };
      case "symptoms":
        return { bg: "#FEE2E2", emoji: "⚠️" };
      case "meals":
        return { bg: "#FED7AA", emoji: "🍽️" };
      default:
        return { bg: "#D1FAE5", emoji: "📝" };
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: highContrastMode ? "#000" : "#fff", borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.accent : colors.title, fontWeight: "900", fontSize: 20 }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.accent : colors.teal }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>❤</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Health Logs</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Recent vital measurements</Text>
            </View>

            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.accent : colors.muted, fontWeight: "900", fontSize: 18 }}>
                →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back button (sticky in web; here top card) */}
          <Pressable
            onPress={() => router.push("/health")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
              ← Back to Notes & Health Logs
            </Text>
          </Pressable>

          {/* Main Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ marginBottom: 14 }}>
              <Text style={[styles.bigTitle, { color: colors.title }]}>Health Logs</Text>
              <Text style={[styles.bigSub, { color: colors.sub }]}>Recent vital measurements</Text>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
              <Pressable onPress={() => setSelectedCategory("all")}>
                <Text style={[styles.filterText, { color: selectedCategory === "all" ? colors.title : colors.muted, fontWeight: "900" }]}>
                  • View All
                </Text>
              </Pressable>

              {(["vital", "mood", "symptoms", "meals"] as const).map((c) => (
                <Pressable key={c} onPress={() => setSelectedCategory(c)}>
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: selectedCategory === c ? colors.title : colors.muted,
                        fontWeight: selectedCategory === c ? "900" : "800",
                      },
                    ]}
                  >
                    {c === "vital"
                      ? "Vital Measurements"
                      : c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Add Entry */}
            <View style={{ alignItems: "flex-end", marginBottom: 14 }}>
              <Pressable
                onPress={() => setShowAddMenu((v) => !v)}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: highContrastMode ? colors.accent : colors.accent },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>＋ Add Entry</Text>
              </Pressable>

              {showAddMenu && (
                <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <MenuItem
                    label="Vital Measurements"
                    onPress={() => {
                      setActiveForm("vital");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop={false}
                  />
                  <MenuItem
                    label="Mood"
                    onPress={() => {
                      setActiveForm("mood");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                  <MenuItem
                    label="Symptoms"
                    onPress={() => {
                      setActiveForm("symptoms");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                  <MenuItem
                    label="Meals"
                    onPress={() => {
                      setActiveForm("meals");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                </View>
              )}
            </View>

            {/* Entries */}
            <View style={{ gap: 12 }}>
              {displayedEntries.map((entry) => {
                const icon = iconForCategory(entry.category);
                const isHolding = longPressEntryId === entry.id;

                return (
                  <Pressable
                    key={entry.id}
                    onPressIn={() => handleLongPressStart(entry.id)}
                    onPressOut={handleLongPressEnd}
                    style={({ pressed }) => [
                      styles.entryRow,
                      {
                        backgroundColor: highContrastMode ? colors.card2 : "#fff",
                        borderColor: highContrastMode ? colors.border : colors.border,
                        opacity: pressed ? 0.96 : 1,
                      },
                      isHolding && { borderColor: colors.accent, borderWidth: 2 },
                    ]}
                  >
                    {/* progress bar */}
                    {isHolding && (
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${longPressProgress}%`, backgroundColor: colors.accent }]} />
                      </View>
                    )}

                    <View style={[styles.entryIcon, { backgroundColor: icon.bg }]}>
                      <Text style={{ fontSize: 18 }}>{icon.emoji}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900", color: colors.title }}>{entry.type}</Text>
                      <Text style={{ marginTop: 2, fontWeight: "800", color: colors.muted }}>
                        {entry.date} at {entry.time}
                      </Text>
                      {isHolding && (
                        <Text style={{ marginTop: 6, fontWeight: "900", color: colors.accent }}>
                          Hold to delete...
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>{entry.value}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* View all / show less */}
            {filteredEntries.length > 5 && !showAll && (
              <Pressable
                onPress={() => setShowAll(true)}
                style={({ pressed }) => [
                  styles.wideBtn,
                  { backgroundColor: highContrastMode ? colors.card2 : "#fff", borderColor: colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>
                  View All ({filteredEntries.length} entries)
                </Text>
              </Pressable>
            )}

            {filteredEntries.length > 5 && showAll && (
              <Pressable
                onPress={() => setShowAll(false)}
                style={({ pressed }) => [
                  styles.wideBtn,
                  { backgroundColor: highContrastMode ? colors.card2 : "#fff", borderColor: colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>Show Less</Text>
              </Pressable>
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Forms (assuming these are RN components using Modal inside or full-screen overlays) */}
        {activeForm === "vital" && <AddVitalForm onClose={() => setActiveForm(null)} />}
        {activeForm === "mood" && <AddMoodForm onClose={() => setActiveForm(null)} />}
        {activeForm === "symptoms" && <AddSymptomsForm onClose={() => setActiveForm(null)} />}
        {activeForm === "meals" && <AddMealsForm onClose={() => setActiveForm(null)} />}

        {/* Delete Confirm Modal */}
        <Modal transparent visible={showDeleteConfirm !== null} animationType="fade" onRequestClose={() => setShowDeleteConfirm(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.confirmCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 1 : 0 }]}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: colors.title }}>Delete Entry?</Text>
              <Text style={{ marginTop: 8, fontWeight: "800", color: highContrastMode ? colors.muted : colors.sub }}>
                Are you sure you want to delete this health entry? This action cannot be undone.
              </Text>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                <Pressable
                  onPress={() => setShowDeleteConfirm(null)}
                  style={({ pressed }) => [
                    styles.confirmBtn,
                    {
                      backgroundColor: highContrastMode ? colors.card2 : "#F9FAFB",
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: colors.title }}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={() => showDeleteConfirm !== null && handleDeleteConfirm(showDeleteConfirm)}
                  style={({ pressed }) => [
                    styles.confirmBtn,
                    { backgroundColor: colors.danger },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: "#fff" }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Bottom Nav */}
        <View style={[styles.nav, { backgroundColor: highContrastMode ? "#000" : "#fff", borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/tasks")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/health")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? colors.accent : "#155DFC", fontWeight: "900" }}>Health</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/messages")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Messages</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/alerts")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Alerts</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  label,
  onPress,
  colors,
  highContrastMode,
  borderTop,
}: {
  label: string;
  onPress: () => void;
  colors: any;
  highContrastMode: boolean;
  borderTop: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        borderTop && { borderTopWidth: 1, borderTopColor: colors.border },
        pressed && { opacity: 0.92 },
      ]}
    >
      <Text style={{ fontWeight: "900", color: highContrastMode ? "#fff" : colors.title }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  bigTitle: { fontSize: 20, fontWeight: "900" },
  bigSub: { marginTop: 4, fontSize: 13, fontWeight: "800" },

  filters: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 14 },
  filterText: { fontSize: 13 },

  addBtn: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },

  menu: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    width: 240,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14 },

  entryRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  entryIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: "#D1D5DB",
  },
  progressFill: { height: 4 },

  wideBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  confirmCard: { width: "100%", maxWidth: 520, borderRadius: 20, padding: 16 },
  confirmBtn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
});
=======
import AddMealsForm from "@/components/AddMealsForm";
import AddMoodForm from "@/components/AddMoodForm";
import AddSymptomsForm from "@/components/AddSymptomsForm";
import AddVitalForm from "@/components/AddVitalForm";
import { useHealthLogs } from "@/context/HealthLogsContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

type Category = "all" | "vital" | "mood" | "symptoms" | "meals";
type FormKey = "vital" | "mood" | "symptoms" | "meals" | null;

export default function HealthLogsScreen() {
  const { highContrastMode } = useTheme();
  const { allEntries, deleteEntry } = useHealthLogs();

  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showAll, setShowAll] = useState(false);

  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [longPressEntryId, setLongPressEntryId] = useState<number | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      card2: highContrastMode ? "#2a2a2a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      muted: highContrastMode ? "#CCCCCC" : "#6B7280",
      accent: highContrastMode ? "#FFFF00" : "#155DFC",
      teal: "#00BBA7",
      danger: highContrastMode ? "#FF4444" : "#EF4444",
    }),
    [highContrastMode]
  );

  // Parse "Jan 3, 2026"
  const parseDate = (dateString: string): Date => {
    const monthNames: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateString.match(/^([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})$/);
    if (!parts) return new Date(0);
    const month = monthNames[parts[1]];
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);
    return new Date(year, month, day);
  };

  const filteredEntries = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? allEntries
        : allEntries.filter((e) => e.category === selectedCategory);

    return [...base].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  }, [allEntries, selectedCategory]);

  const displayedEntries = useMemo(() => {
    return showAll ? filteredEntries : filteredEntries.slice(0, 5);
  }, [filteredEntries, showAll]);

  const clearLongPressTimers = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
    longPressTimerRef.current = null;
    longPressIntervalRef.current = null;
  };

  const handleLongPressStart = (entryId: number) => {
    setLongPressEntryId(entryId);
    setLongPressProgress(0);

    clearLongPressTimers();

    let progress = 0;
    longPressIntervalRef.current = setInterval(() => {
      progress += 1; // 1% every 100ms => 10s total
      setLongPressProgress(progress);
      if (progress >= 100 && longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current);
      }
    }, 100);

    longPressTimerRef.current = setTimeout(() => {
      clearLongPressTimers();
      setShowDeleteConfirm(entryId);
      setLongPressEntryId(null);
      setLongPressProgress(0);
    }, 10000);
  };

  const handleLongPressEnd = () => {
    clearLongPressTimers();
    setLongPressEntryId(null);
    setLongPressProgress(0);
  };

  const handleDeleteConfirm = (entryId: number) => {
    deleteEntry(entryId);
    setShowDeleteConfirm(null);
  };

  useEffect(() => {
    return () => clearLongPressTimers();
  }, []);

  const iconForCategory = (category: string) => {
    switch (category) {
      case "vital":
        return { bg: "#D1FAE5", emoji: "🫀" };
      case "mood":
        return { bg: "#FEF3C7", emoji: "🙂" };
      case "symptoms":
        return { bg: "#FEE2E2", emoji: "⚠️" };
      case "meals":
        return { bg: "#FED7AA", emoji: "🍽️" };
      default:
        return { bg: "#D1FAE5", emoji: "📝" };
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: highContrastMode ? "#000" : "#fff", borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.accent : colors.title, fontWeight: "900", fontSize: 20 }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.accent : colors.teal }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>❤</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Health Logs</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Recent vital measurements</Text>
            </View>

            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.accent : colors.muted, fontWeight: "900", fontSize: 18 }}>
                →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back button (sticky in web; here top card) */}
          <Pressable
            onPress={() => router.push("/health")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
              ← Back to Notes & Health Logs
            </Text>
          </Pressable>

          {/* Main Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ marginBottom: 14 }}>
              <Text style={[styles.bigTitle, { color: colors.title }]}>Health Logs</Text>
              <Text style={[styles.bigSub, { color: colors.sub }]}>Recent vital measurements</Text>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
              <Pressable onPress={() => setSelectedCategory("all")}>
                <Text style={[styles.filterText, { color: selectedCategory === "all" ? colors.title : colors.muted, fontWeight: "900" }]}>
                  • View All
                </Text>
              </Pressable>

              {(["vital", "mood", "symptoms", "meals"] as const).map((c) => (
                <Pressable key={c} onPress={() => setSelectedCategory(c)}>
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: selectedCategory === c ? colors.title : colors.muted,
                        fontWeight: selectedCategory === c ? "900" : "800",
                      },
                    ]}
                  >
                    {c === "vital"
                      ? "Vital Measurements"
                      : c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Add Entry */}
            <View style={{ alignItems: "flex-end", marginBottom: 14 }}>
              <Pressable
                onPress={() => setShowAddMenu((v) => !v)}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: highContrastMode ? colors.accent : colors.accent },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>＋ Add Entry</Text>
              </Pressable>

              {showAddMenu && (
                <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <MenuItem
                    label="Vital Measurements"
                    onPress={() => {
                      setActiveForm("vital");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop={false}
                  />
                  <MenuItem
                    label="Mood"
                    onPress={() => {
                      setActiveForm("mood");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                  <MenuItem
                    label="Symptoms"
                    onPress={() => {
                      setActiveForm("symptoms");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                  <MenuItem
                    label="Meals"
                    onPress={() => {
                      setActiveForm("meals");
                      setShowAddMenu(false);
                    }}
                    highContrastMode={highContrastMode}
                    colors={colors}
                    borderTop
                  />
                </View>
              )}
            </View>

            {/* Entries */}
            <View style={{ gap: 12 }}>
              {displayedEntries.map((entry) => {
                const icon = iconForCategory(entry.category);
                const isHolding = longPressEntryId === entry.id;

                return (
                  <Pressable
                    key={entry.id}
                    onPressIn={() => handleLongPressStart(entry.id)}
                    onPressOut={handleLongPressEnd}
                    style={({ pressed }) => [
                      styles.entryRow,
                      {
                        backgroundColor: highContrastMode ? colors.card2 : "#fff",
                        borderColor: highContrastMode ? colors.border : colors.border,
                        opacity: pressed ? 0.96 : 1,
                      },
                      isHolding && { borderColor: colors.accent, borderWidth: 2 },
                    ]}
                  >
                    {/* progress bar */}
                    {isHolding && (
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${longPressProgress}%`, backgroundColor: colors.accent }]} />
                      </View>
                    )}

                    <View style={[styles.entryIcon, { backgroundColor: icon.bg }]}>
                      <Text style={{ fontSize: 18 }}>{icon.emoji}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900", color: colors.title }}>{entry.type}</Text>
                      <Text style={{ marginTop: 2, fontWeight: "800", color: colors.muted }}>
                        {entry.date} at {entry.time}
                      </Text>
                      {isHolding && (
                        <Text style={{ marginTop: 6, fontWeight: "900", color: colors.accent }}>
                          Hold to delete...
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>{entry.value}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* View all / show less */}
            {filteredEntries.length > 5 && !showAll && (
              <Pressable
                onPress={() => setShowAll(true)}
                style={({ pressed }) => [
                  styles.wideBtn,
                  { backgroundColor: highContrastMode ? colors.card2 : "#fff", borderColor: colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>
                  View All ({filteredEntries.length} entries)
                </Text>
              </Pressable>
            )}

            {filteredEntries.length > 5 && showAll && (
              <Pressable
                onPress={() => setShowAll(false)}
                style={({ pressed }) => [
                  styles.wideBtn,
                  { backgroundColor: highContrastMode ? colors.card2 : "#fff", borderColor: colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>Show Less</Text>
              </Pressable>
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Forms (assuming these are RN components using Modal inside or full-screen overlays) */}
        {activeForm === "vital" && <AddVitalForm onClose={() => setActiveForm(null)} />}
        {activeForm === "mood" && <AddMoodForm onClose={() => setActiveForm(null)} />}
        {activeForm === "symptoms" && <AddSymptomsForm onClose={() => setActiveForm(null)} />}
        {activeForm === "meals" && <AddMealsForm onClose={() => setActiveForm(null)} />}

        {/* Delete Confirm Modal */}
        <Modal transparent visible={showDeleteConfirm !== null} animationType="fade" onRequestClose={() => setShowDeleteConfirm(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.confirmCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 1 : 0 }]}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: colors.title }}>Delete Entry?</Text>
              <Text style={{ marginTop: 8, fontWeight: "800", color: highContrastMode ? colors.muted : colors.sub }}>
                Are you sure you want to delete this health entry? This action cannot be undone.
              </Text>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                <Pressable
                  onPress={() => setShowDeleteConfirm(null)}
                  style={({ pressed }) => [
                    styles.confirmBtn,
                    {
                      backgroundColor: highContrastMode ? colors.card2 : "#F9FAFB",
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: colors.title }}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={() => showDeleteConfirm !== null && handleDeleteConfirm(showDeleteConfirm)}
                  style={({ pressed }) => [
                    styles.confirmBtn,
                    { backgroundColor: colors.danger },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: "#fff" }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Bottom Nav */}
        <View style={[styles.nav, { backgroundColor: highContrastMode ? "#000" : "#fff", borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/tasks")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/health")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? colors.accent : "#155DFC", fontWeight: "900" }}>Health</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/messages")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Messages</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/alerts")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Alerts</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  label,
  onPress,
  colors,
  highContrastMode,
  borderTop,
}: {
  label: string;
  onPress: () => void;
  colors: any;
  highContrastMode: boolean;
  borderTop: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        borderTop && { borderTopWidth: 1, borderTopColor: colors.border },
        pressed && { opacity: 0.92 },
      ]}
    >
      <Text style={{ fontWeight: "900", color: highContrastMode ? "#fff" : colors.title }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  bigTitle: { fontSize: 20, fontWeight: "900" },
  bigSub: { marginTop: 4, fontSize: 13, fontWeight: "800" },

  filters: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 14 },
  filterText: { fontSize: 13 },

  addBtn: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },

  menu: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    width: 240,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14 },

  entryRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  entryIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: "#D1D5DB",
  },
  progressFill: { height: 4 },

  wideBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  confirmCard: { width: "100%", maxWidth: 520, borderRadius: 20, padding: 16 },
  confirmBtn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
});
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
