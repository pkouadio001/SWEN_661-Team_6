import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string; // "Jan 23, 2026"
  time: string; // "8:00 AM"
}

const STORAGE_KEY = "personalNotes";

const defaultNotes: Note[] = [
  {
    id: 1,
    title: "Feeling better today",
    content: "Energy levels are up. Managed to take a short walk around the block.",
    date: "Jan 23, 2026",
    time: "8:00 AM",
  },
  {
    id: 2,
    title: "Mild headache",
    content: "Started around noon. Took one aspirin. Better by evening.",
    date: "Jan 22, 2026",
    time: "6:30 PM",
  },
  {
    id: 3,
    title: "Sleep quality improving",
    content: "Slept for 7 hours straight. Feeling more rested than usual.",
    date: "Jan 21, 2026",
    time: "7:15 AM",
  },
  {
    id: 4,
    title: "New medication side effects",
    content: "Slight nausea in the morning. Will monitor and report to doctor if it continues.",
    date: "Jan 20, 2026",
    time: "9:30 AM",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatNowDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNowTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function formatDateForComparison(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PersonalNotesScreen() {
  const { highContrastMode } = useTheme();

  const [notes, setNotes] = useState<Note[]>(defaultNotes);

  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [deleteHoldProgress, setDeleteHoldProgress] = useState(0);
  const [isHoldingDelete, setIsHoldingDelete] = useState(false);

  const deleteHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const deleteHoldIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      headerBg: highContrastMode ? "#000000" : "#FFFFFF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      primary: highContrastMode ? "#FFFF00" : "#155DFC",
      teal: "#00BBA7",
      danger: "#DC2626",
      dangerSoft: highContrastMode ? "rgba(255,107,107,0.2)" : "#FEF2F2",

      chipBg: highContrastMode ? "#2a2a2a" : "#F9FAFB",
      noteCardBg: highContrastMode ? "#2a2a2a" : "#FFFFFF",

      inputBg: highContrastMode ? "#2a2a2a" : "#F9FAFB",
      inputBorder: highContrastMode ? "#FFFF00" : "#E5E7EB",
      inputText: highContrastMode ? "#FFFFFF" : "#101828",
      placeholder: highContrastMode ? "#AAAAAA" : "#9CA3AF",

      modalBackdrop: highContrastMode ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.50)",
    }),
    [highContrastMode],
  );

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setNotes(parsed);
        }
      } catch (e) {
        console.warn("Error reading notes from AsyncStorage:", e);
      }
    })();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.warn("Error saving notes to AsyncStorage:", e);
      }
    })();
  }, [notes]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (deleteHoldTimerRef.current) clearTimeout(deleteHoldTimerRef.current);
      if (deleteHoldIntervalRef.current) clearInterval(deleteHoldIntervalRef.current);
    };
  }, []);

  const uniqueDates = useMemo(() => [...new Set(notes.map((n) => n.date))], [notes]);

  const filteredNotes = useMemo(() => {
    if (!selectedDateFilter) return notes;
    return notes.filter((n) => n.date === selectedDateFilter);
  }, [notes, selectedDateFilter]);

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowEditNoteModal(true);
  };

  const openDeleteModal = (note: Note) => {
    setSelectedNote(note);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowNewNoteModal(false);
    setShowEditNoteModal(false);
    setShowDeleteModal(false);
    setShowDatePicker(false);
    setSelectedNote(null);
    setNoteTitle("");
    setNoteContent("");
    handleDeleteHoldEnd();
  };

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const now = new Date();
    const newNote: Note = {
      id: Date.now(),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };

    setNotes([newNote, ...notes]);
    setNoteTitle("");
    setNoteContent("");
    setShowNewNoteModal(false);
  };

  const handleEditNote = () => {
    if (!selectedNote || !noteTitle.trim() || !noteContent.trim()) return;

    const now = new Date();
    setNotes(
      notes.map((n) =>
        n.id === selectedNote.id
          ? {
              ...n,
              title: noteTitle.trim(),
              content: noteContent.trim(),
              date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
            }
          : n,
      ),
    );

    setNoteTitle("");
    setNoteContent("");
    setSelectedNote(null);
    setShowEditNoteModal(false);
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    setNotes(notes.filter((n) => n.id !== selectedNote.id));
    setSelectedNote(null);
    setShowDeleteModal(false);
  };

  const handleDeleteHoldStart = () => {
    setIsHoldingDelete(true);
    setDeleteHoldProgress(0);

    let progress = 0;

    deleteHoldIntervalRef.current = setInterval(() => {
      progress += 10; // 0..100
      setDeleteHoldProgress(progress);
      if (progress >= 100 && deleteHoldIntervalRef.current) {
        clearInterval(deleteHoldIntervalRef.current);
      }
    }, 50);

    deleteHoldTimerRef.current = setTimeout(() => {
      if (deleteHoldIntervalRef.current) clearInterval(deleteHoldIntervalRef.current);
      handleDeleteNote();
      setIsHoldingDelete(false);
      setDeleteHoldProgress(0);
    }, 5000);
  };

  const handleDeleteHoldEnd = () => {
    if (deleteHoldTimerRef.current) clearTimeout(deleteHoldTimerRef.current);
    if (deleteHoldIntervalRef.current) clearInterval(deleteHoldIntervalRef.current);
    setIsHoldingDelete(false);
    setDeleteHoldProgress(0);
  };

  // Calendar generation
  const daysInMonth = getDaysInMonth(calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarMonth);
  const calendarDays: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/health")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.primary : colors.title, fontSize: 20, fontWeight: "900" }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.primary : colors.primary }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>📝</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Personal Notes</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Track your thoughts and symptoms</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back */}
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

          {/* Main Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bigTitle, { color: colors.title }]}>Personal Notes</Text>
                <Text style={[styles.smallSub, { color: colors.sub }]}>Track your thoughts and symptoms</Text>
              </View>

              <View style={{ gap: 10 }}>
                <Pressable
                  onPress={() => setShowNewNoteModal(true)}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { borderColor: colors.border, backgroundColor: colors.chipBg },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
                    ＋ New Note
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    selectedDateFilter
                      ? { backgroundColor: highContrastMode ? colors.primary : colors.primary, borderColor: highContrastMode ? colors.primary : colors.primary }
                      : { borderColor: colors.border, backgroundColor: colors.chipBg },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "900",
                      color: selectedDateFilter ? (highContrastMode ? "#000" : "#fff") : (highContrastMode ? colors.primary : colors.title),
                    }}
                  >
                    📅 {selectedDateFilter ? selectedDateFilter : "Filter by Date"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Notes List */}
            <View style={{ marginTop: 14, gap: 12 }}>
              {filteredNotes.map((note) => (
                <View
                  key={note.id}
                  style={[
                    styles.noteCard,
                    { backgroundColor: colors.noteCardBg, borderColor: colors.border },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900", color: colors.title }}>{note.title}</Text>
                      <Text
                        numberOfLines={2}
                        style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? colors.sub : colors.sub }}
                      >
                        {note.content}
                      </Text>
                      <Text style={{ marginTop: 8, fontWeight: "800", color: highContrastMode ? "#CCCCCC" : "#9CA3AF" }}>
                        {note.date} - {note.time}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Pressable onPress={() => openEditModal(note)} style={({ pressed }) => [styles.iconAction, pressed && { opacity: 0.8 }]}>
                        <Text style={{ color: highContrastMode ? colors.primary : colors.primary, fontWeight: "900" }}>✎</Text>
                      </Pressable>
                      <Pressable onPress={() => openDeleteModal(note)} style={({ pressed }) => [styles.iconAction, pressed && { opacity: 0.8 }]}>
                        <Text style={{ color: colors.danger, fontWeight: "900" }}>🗑</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}

              {filteredNotes.length === 0 && (
                <View style={{ alignItems: "center", paddingVertical: 28 }}>
                  <View style={[styles.emptyIcon, { backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF" }]}>
                    <Text style={{ fontSize: 22 }}>📝</Text>
                  </View>
                  <Text style={{ marginTop: 10, fontWeight: "900", fontSize: 16, color: colors.title }}>
                    {selectedDateFilter ? "No notes on this date" : "No notes yet"}
                  </Text>
                  <Text style={{ marginTop: 6, fontWeight: "800", color: colors.sub }}>
                    {selectedDateFilter ? "Try selecting a different date" : 'Tap "New Note" to add your first note'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Calendar Modal */}
        <Modal transparent visible={showDatePicker} animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View
                style={[
                  styles.modalHeader,
                  { backgroundColor: highContrastMode ? colors.primary : colors.primary },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Pressable onPress={handlePrevMonth} style={styles.navBtn}>
                    <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>‹</Text>
                  </Pressable>

                  <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>
                    {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </Text>

                  <Pressable onPress={handleNextMonth} style={styles.navBtn}>
                    <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>›</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {dayNames.map((d) => (
                    <View key={d} style={[styles.dayNameCell]}>
                      <Text style={{ fontWeight: "900", color: colors.sub }}>{d}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                  {calendarDays.map((day, idx) => {
                    if (!day) return <View key={`e-${idx}`} style={styles.dayCell} />;

                    const formatted = formatDateForComparison(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth(),
                      day,
                    );
                    const hasNotes = uniqueDates.includes(formatted);
                    const isSelected = selectedDateFilter === formatted;

                    const bg =
                      isSelected
                        ? (highContrastMode ? colors.primary : colors.primary)
                        : hasNotes
                          ? (highContrastMode ? colors.primary : "#EFF6FF")
                          : "transparent";

                    const textColor =
                      isSelected
                        ? (highContrastMode ? "#000" : "#fff")
                        : hasNotes
                          ? (highContrastMode ? "#000" : colors.primary)
                          : colors.title;

                    const borderColor =
                      hasNotes && !isSelected ? (highContrastMode ? colors.primary : colors.primary) : "transparent";

                    return (
                      <View key={`d-${idx}`} style={styles.dayCell}>
                        <Pressable
                          onPress={() => handleDateSelect(day)}
                          style={({ pressed }) => [
                            styles.dayBtn,
                            { backgroundColor: bg, borderColor: borderColor },
                            pressed && { opacity: 0.85 },
                          ]}
                        >
                          <Text style={{ fontWeight: "900", color: textColor }}>{day}</Text>
                          {hasNotes && !isSelected ? (
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: highContrastMode ? "#000" : colors.primary },
                              ]}
                            />
                          ) : null}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <Pressable
                  onPress={() => {
                    setSelectedDateFilter(null);
                    setShowDatePicker(false);
                  }}
                  style={({ pressed }) => [
                    styles.footerBtn,
                    { borderColor: colors.border },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
                    Clear Filter
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  style={({ pressed }) => [
                    styles.footerBtnPrimary,
                    { backgroundColor: highContrastMode ? colors.primary : colors.primary },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>
                    Done
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* New Note Modal */}
        <Modal transparent visible={showNewNoteModal} animationType="fade" onRequestClose={closeAllModals}>
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.simpleModal, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.simpleModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>New Note</Text>
                  <Text style={{ marginTop: 4, fontWeight: "800", color: colors.sub }}>Add a new personal note</Text>
                </View>
                <Pressable onPress={closeAllModals} style={styles.closeBtn}>
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>✕</Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                <LabeledInput
                  label="Title"
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                  colors={colors}
                  highContrastMode={highContrastMode}
                />
                <LabeledInput
                  label="Note"
                  value={noteContent}
                  onChangeText={setNoteContent}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  multiline
                />

                <Pressable
                  onPress={handleAddNote}
                  style={({ pressed }) => [
                    styles.primaryWide,
                    { backgroundColor: highContrastMode ? colors.primary : colors.primary },
                    pressed && { opacity: 0.9 },
                  ]}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>
                    Add Note
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Note Modal */}
        <Modal transparent visible={showEditNoteModal} animationType="fade" onRequestClose={closeAllModals}>
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.simpleModal, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.simpleModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>Edit Note</Text>
                  <Text style={{ marginTop: 4, fontWeight: "800", color: colors.sub }}>Update your personal note</Text>
                </View>
                <Pressable onPress={closeAllModals} style={styles.closeBtn}>
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>✕</Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                <LabeledInput
                  label="Title"
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                  colors={colors}
                  highContrastMode={highContrastMode}
                />
                <LabeledInput
                  label="Note"
                  value={noteContent}
                  onChangeText={setNoteContent}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  multiline
                />

                <Pressable
                  onPress={handleEditNote}
                  style={({ pressed }) => [
                    styles.primaryWide,
                    { backgroundColor: highContrastMode ? colors.primary : colors.primary },
                    pressed && { opacity: 0.9 },
                  ]}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>
                    Save Changes
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Modal */}
        <Modal transparent visible={showDeleteModal} animationType="fade" onRequestClose={closeAllModals}>
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.simpleModal, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.simpleModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>Delete Note</Text>
                </View>
                <Pressable onPress={closeAllModals} style={styles.closeBtn}>
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>✕</Text>
                </Pressable>
              </View>

              <Text style={{ fontWeight: "800", color: colors.sub, marginBottom: 12 }}>
                Are you sure you want to delete this note? This action cannot be undone.
              </Text>

              <View style={[styles.warningBox, { backgroundColor: colors.dangerSoft, borderColor: highContrastMode ? "#FF6B6B" : "#FCA5A5" }]}>
                <Text style={{ fontWeight: "900", color: colors.title, marginBottom: 6 }}>
                  {selectedNote?.title}
                </Text>
                <Text numberOfLines={2} style={{ fontWeight: "800", color: highContrastMode ? "#CCCCCC" : "#6B7280" }}>
                  {selectedNote?.content}
                </Text>
              </View>

              <View style={{ gap: 10 }}>
                <Pressable
                  onPressIn={handleDeleteHoldStart}
                  onPressOut={handleDeleteHoldEnd}
                  style={({ pressed }) => [
                    styles.deleteHoldBtn,
                    { backgroundColor: colors.danger },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  {isHoldingDelete ? (
                    <View style={styles.progressWrap}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${deleteHoldProgress}%` }]} />
                      </View>
                    </View>
                  ) : null}

                  <Text style={{ fontWeight: "900", color: "#fff" }}>
                    Delete Note {isHoldingDelete ? `(${Math.round(deleteHoldProgress / 20)}s)` : ""}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={closeAllModals}
                  style={({ pressed }) => [
                    styles.footerBtn,
                    { borderColor: colors.border, backgroundColor: highContrastMode ? "#2a2a2a" : "#fff" },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function LabeledInput(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  colors: any;
  highContrastMode: boolean;
  multiline?: boolean;
}) {
  const { label, value, onChangeText, colors, highContrastMode, multiline } = props;

  return (
    <View>
      <Text style={{ fontSize: 13, fontWeight: "900", color: highContrastMode ? colors.sub : colors.title, marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.placeholder}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
            height: multiline ? 110 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
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

  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  bigTitle: { fontSize: 20, fontWeight: "900" },
  smallSub: { marginTop: 4, fontWeight: "800" },

  actionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  noteCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },

  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },

  modalCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 22,
    overflow: "hidden",
  },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14 },
  navBtn: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 12 },

  dayNameCell: {
    width: `${100 / 7}%`,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCell: {
    width: `${100 / 7}%`,
    padding: 4,
    height: 54,
  },
  dayBtn: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },

  modalFooter: {
    borderTopWidth: 1,
    padding: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  footerBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  footerBtnPrimary: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  simpleModal: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 22,
    padding: 16,
  },
  simpleModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  closeBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontWeight: "800",
  },

  primaryWide: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  warningBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  deleteHoldBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  progressWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
  },
  progressTrack: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});
