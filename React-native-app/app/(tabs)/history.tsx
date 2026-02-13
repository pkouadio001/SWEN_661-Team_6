import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useHealthLogs } from "@/context/HealthLogsContext";
import { useTheme } from "@/context/ThemeContext";

type HealthCategory = "vital" | "mood" | "symptoms" | "meals";

interface HistoryEntry {
  id: number;
  type: "note" | "health" | "appointment";
  title: string;
  content?: string;
  value?: string;
  date: string; // e.g. "Jan 25, 2026"
  time: string; // e.g. "10:30 AM" (or "10:30")
  timestamp: Date;
  category?: HealthCategory;
}

type PersonalNoteStored = {
  title: string;
  content: string;
  date: string;
  time: string;
};

export default function HistoryScreen() {
  const { highContrastMode } = useTheme();
  const { allEntries: healthLogEntries } = useHealthLogs();

  const [showAll, setShowAll] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#fff",
      card2: highContrastMode ? "#2a2a2a" : "#fff",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#fff" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      muted: highContrastMode ? "#CCCCCC" : "#6B7280",
      primary: highContrastMode ? "#FFFF00" : "#155DFC",
      purple: "#A855F7",
      teal: "#00BBA7",
      noteBg: "#FFFBEB",
      noteBorder: "#FEF3C7",
      apptBg: "#EEF2FF",
      apptBorder: "#E0E7FF",
      moodBg: "#FEF3C7",
      moodBorder: "#FCD34D",
      symBg: "#FEE2E2",
      symBorder: "#FECACA",
      mealsBg: "#FED7AA",
      mealsBorder: "#FDBA74",
      vitalBg: "#D1FAE5",
      vitalBorder: "#A7F3D0",
    }),
    [highContrastMode]
  );

  // Parse "Jan 25, 2026 10:30 AM"
  const parseHistoryDate = (dateTimeString: string): Date => {
    try {
      const d = new Date(dateTimeString);
      if (Number.isNaN(d.getTime())) return new Date(0);
      return d;
    } catch {
      return new Date(0);
    }
  };

  useEffect(() => {
    const load = async () => {
      const combined: HistoryEntry[] = [];

      // Health logs from context
      healthLogEntries.forEach((entry: any) => {
        combined.push({
          id: entry.id,
          type: "health",
          title: entry.type,
          value: entry.value,
          date: entry.date,
          time: entry.time,
          timestamp: parseHistoryDate(`${entry.date} ${entry.time}`),
          category: entry.category,
        });
      });

      // Personal notes from AsyncStorage
      const storedNotes = await AsyncStorage.getItem("personalNotes");
      if (storedNotes) {
        try {
          const parsed: PersonalNoteStored[] = JSON.parse(storedNotes);
          parsed.forEach((note) => {
            combined.push({
              id: Math.floor(Date.now() + Math.random() * 100000),
              type: "note",
              title: note.title,
              content: note.content,
              date: note.date,
              time: note.time,
              timestamp: parseHistoryDate(`${note.date} ${note.time}`),
            });
          });
        } catch (e) {
          console.log("Error parsing notes:", e);
        }
      }

      // Sort newest first
      combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setEntries(combined);
    };

    load();
  }, [healthLogEntries]);

  const filteredEntries = useMemo(() => {
    return selectedDateFilter ? entries.filter((e) => e.date === selectedDateFilter) : entries;
  }, [entries, selectedDateFilter]);

  const displayedEntries = useMemo(() => {
    return showAll ? filteredEntries : filteredEntries.slice(0, 5);
  }, [filteredEntries, showAll]);

  const groupedEntries = useMemo(() => {
    return displayedEntries.reduce((groups: Record<string, HistoryEntry[]>, entry) => {
      const d = entry.date;
      if (!groups[d]) groups[d] = [];
      groups[d].push(entry);
      return groups;
    }, {});
  }, [displayedEntries]);

  const uniqueDates = useMemo(() => [...new Set(entries.map((e) => e.date))], [entries]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDateForComparison = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = formatDateForComparison(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    setSelectedDateFilter(selected);
    setShowDatePicker(false);
    setShowAll(false);
  };

  const calendarDays = useMemo(() => {
    const days: Array<number | null> = [];
    const daysInMonth = getDaysInMonth(calendarMonth);
    const first = getFirstDayOfMonth(calendarMonth);

    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [calendarMonth]);

  const getEntryStyles = (type: HistoryEntry["type"], category?: HealthCategory) => {
    if (type === "note") return { bg: colors.noteBg, border: colors.noteBorder, icon: "📝", iconColor: "#F59E0B" };
    if (type === "appointment") return { bg: colors.apptBg, border: colors.apptBorder, icon: "📅", iconColor: "#6366F1" };

    switch (category) {
      case "mood":
        return { bg: colors.moodBg, border: colors.moodBorder, icon: "🙂", iconColor: "#FFB800" };
      case "symptoms":
        return { bg: colors.symBg, border: colors.symBorder, icon: "⚠️", iconColor: "#EF4444" };
      case "meals":
        return { bg: colors.mealsBg, border: colors.mealsBorder, icon: "🍽️", iconColor: "#FF9500" };
      case "vital":
      default:
        return { bg: colors.vitalBg, border: colors.vitalBorder, icon: "❤", iconColor: colors.teal };
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: highContrastMode ? "#000" : "#fff", borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.primary : colors.title, fontWeight: "900", fontSize: 20 }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.primary : colors.purple }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>⏱</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>History</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Your complete health and notes timeline</Text>
            </View>

            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.primary : colors.muted, fontWeight: "900", fontSize: 18 }}>
                →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Health */}
          <Pressable
            onPress={() => router.push("/health")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
              ← Back to Notes & Health Logs
            </Text>
          </Pressable>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Filter button */}
            <View style={{ alignItems: "flex-end", marginBottom: 14 }}>
              <Pressable
                onPress={() => setShowDatePicker((v) => !v)}
                style={({ pressed }) => [
                  styles.filterBtn,
                  {
                    backgroundColor: selectedDateFilter
                      ? (highContrastMode ? colors.primary : colors.primary)
                      : (highContrastMode ? colors.card2 : "#fff"),
                    borderColor: selectedDateFilter ? colors.primary : colors.border,
                  },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontWeight: "900", color: selectedDateFilter ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? colors.primary : colors.title) }}>
                  {selectedDateFilter ?? "Filter by Date"}
                </Text>
              </Pressable>
            </View>

            {/* Calendar modal */}
            <Modal transparent visible={showDatePicker} animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
              <View style={styles.modalBackdrop}>
                <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
                  {/* Calendar header */}
                  <View style={[styles.calendarHeader, { backgroundColor: highContrastMode ? colors.primary : colors.primary }]}>
                    <View style={styles.calendarHeaderRow}>
                      <Pressable onPress={handlePrevMonth} style={styles.calNavBtn}>
                        <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>←</Text>
                      </Pressable>

                      <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>
                        {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                      </Text>

                      <Pressable onPress={handleNextMonth} style={styles.calNavBtn}>
                        <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>→</Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* Calendar body */}
                  <View style={{ padding: 14 }}>
                    <View style={styles.dayNameRow}>
                      {dayNames.map((d) => (
                        <Text key={d} style={{ width: "14.285%", textAlign: "center", fontWeight: "900", color: colors.sub }}>
                          {d}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.daysGrid}>
                      {calendarDays.map((day, idx) => {
                        if (!day) return <View key={idx} style={styles.dayCell} />;

                        const formatted = formatDateForComparison(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          day
                        );

                        const hasEntries = uniqueDates.includes(formatted);
                        const isSelected = selectedDateFilter === formatted;

                        const bg = isSelected
                          ? colors.primary
                          : hasEntries
                            ? (highContrastMode ? colors.primary : "#EFF6FF")
                            : "transparent";

                        const textColor = isSelected
                          ? (highContrastMode ? "#000" : "#fff")
                          : hasEntries
                            ? (highContrastMode ? "#000" : colors.primary)
                            : (highContrastMode ? "#fff" : colors.title);

                        const borderColor = isSelected
                          ? colors.primary
                          : hasEntries
                            ? colors.primary
                            : "transparent";

                        return (
                          <View key={idx} style={styles.dayCell}>
                            <Pressable
                              onPress={() => handleDateSelect(day)}
                              style={({ pressed }) => [
                                styles.dayBtn,
                                { backgroundColor: bg, borderColor, borderWidth: hasEntries && !isSelected ? 2 : isSelected ? 2 : 0 },
                                pressed && { opacity: 0.92 },
                              ]}
                            >
                              <Text style={{ fontWeight: "900", color: textColor }}>{day}</Text>
                              {hasEntries && !isSelected && (
                                <View style={[styles.dot, { backgroundColor: highContrastMode ? "#000" : colors.primary }]} />
                              )}
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Calendar footer */}
                  <View style={[styles.calendarFooter, { borderTopColor: colors.border }]}>
                    <Pressable
                      onPress={() => {
                        setSelectedDateFilter(null);
                        setShowDatePicker(false);
                        setShowAll(false);
                      }}
                      style={({ pressed }) => [
                        styles.footerBtn,
                        { backgroundColor: highContrastMode ? colors.card2 : "#fff", borderColor: colors.border },
                        pressed && { opacity: 0.92 },
                      ]}
                    >
                      <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>Clear</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowDatePicker(false)}
                      style={({ pressed }) => [
                        styles.footerBtn,
                        { backgroundColor: colors.primary, borderColor: colors.primary },
                        pressed && { opacity: 0.92 },
                      ]}
                    >
                      <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>Done</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Timeline */}
            <View style={{ gap: 16 }}>
              {Object.entries(groupedEntries).map(([date, dateEntries]) => (
                <View key={date}>
                  <View style={styles.dateRow}>
                    <View style={[styles.bullet, { backgroundColor: colors.teal }]} />
                    <Text style={{ fontWeight: "900", color: colors.muted }}>{date}</Text>
                  </View>

                  <View style={{ marginLeft: 24, gap: 10 }}>
                    {dateEntries.map((entry) => {
                      const s = getEntryStyles(entry.type, entry.category);

                      return (
                        <View
                          key={entry.id}
                          style={[
                            styles.entryCard,
                            {
                              backgroundColor: s.bg,
                              borderColor: s.border,
                            },
                          ]}
                        >
                          <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                            <Text style={{ fontSize: 18 }}>{s.icon}</Text>

                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                                <Text style={{ fontWeight: "900", color: "#101828", flex: 1 }} numberOfLines={2}>
                                  {entry.title}
                                </Text>

                                {entry.value ? (
                                  <Text style={{ fontWeight: "900", color: "#101828" }}>{entry.value}</Text>
                                ) : null}
                              </View>

                              {entry.content ? (
                                <Text style={{ marginTop: 4, fontWeight: "800", color: "#6B7280" }}>
                                  {entry.content}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            {/* Show less */}
            {showAll && filteredEntries.length > 5 && (
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

            {/* Empty */}
            {filteredEntries.length === 0 && (
              <View style={{ paddingVertical: 36, alignItems: "center" }}>
                <View style={[styles.emptyIcon, { backgroundColor: highContrastMode ? colors.card2 : "#F3E8FF" }]}>
                  <Text style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? colors.primary : colors.purple }}>
                    ⏱
                  </Text>
                </View>

                <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "900", color: colors.title }}>
                  {selectedDateFilter ? "No history on this date" : "No history yet"}
                </Text>
                <Text style={{ marginTop: 6, fontWeight: "800", color: colors.sub }}>
                  {selectedDateFilter ? "Try selecting a different date" : "Your health logs and notes will appear here"}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

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
              <Text style={{ color: highContrastMode ? colors.primary : "#155DFC", fontWeight: "900" }}>Health</Text>
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

  filterBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  calendarCard: { width: "100%", maxWidth: 420, borderRadius: 22, overflow: "hidden" },
  calendarHeader: { padding: 14 },
  calendarHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  calNavBtn: { padding: 8, borderRadius: 12 },

  dayNameRow: { flexDirection: "row", marginBottom: 10 },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.285%", height: 46, padding: 3 },
  dayBtn: { flex: 1, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", bottom: 6, width: 6, height: 6, borderRadius: 3 },

  calendarFooter: { flexDirection: "row", gap: 10, padding: 12, borderTopWidth: 1, justifyContent: "flex-end" },
  footerBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  bullet: { width: 8, height: 8, borderRadius: 4 },

  entryCard: { borderWidth: 2, borderRadius: 18, padding: 14 },

  wideBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  emptyIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
