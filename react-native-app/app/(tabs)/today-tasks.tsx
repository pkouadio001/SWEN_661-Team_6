import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Task, useTasks } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";

// Function to format date and time - handles both pre-formatted and raw dates
const formatDateTime = (date: string, time: string): string => {
  let shortDate = date;
  let formattedTime = time;

  // If date doesn't look like "Jan 25" format, convert it
  if (!date.match(/^[A-Z][a-z]{2} \d{1,2}/)) {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    shortDate = dateObj.toLocaleDateString("en-US", options);
  }

  // If time doesn't have AM/PM, add it
  if (!time.includes("AM") && !time.includes("PM")) {
    const timeParts = time.split(":");
    const hour = parseInt(timeParts[0] || "0", 10);
    const minutes = timeParts[1] || "00";
    const meridiem = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    formattedTime = `${displayHour}:${minutes} ${meridiem}`;
  }

  return `${shortDate} at ${formattedTime}`;
};

// ---- Calendar helpers (same logic you had on web) ----
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getMonthYear = (monthIndex: number) => {
  const baseDate = new Date(2026, 0, 1); // Jan 1, 2026
  baseDate.setMonth(baseDate.getMonth() + monthIndex);
  return baseDate;
};

const generateCalendarDays = (monthIndex: number) => {
  const date = getMonthYear(monthIndex);
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
};

export default function TodayTasksScreen() {
  const { highContrastMode } = useTheme();
  const { allTasks, toggleTask, deleteTask, updateTask } = useTasks();

  const [view, setView] = useState<"schedule" | "calendar">("schedule");

  // menus + modals
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // edit form
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // calendar state
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(25);

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    headerBg: highContrastMode ? "#000000" : "#FFFFFF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    cardAlt: highContrastMode ? "#2a2a2a" : "#FFFFFF",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    title: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    muted: highContrastMode ? "#FFFFFF" : "#6B7280",
    primary: highContrastMode ? "#FFFF00" : "#155DFC",
    primaryText: highContrastMode ? "#000000" : "#FFFFFF",
    goodBg: highContrastMode ? "#FFFF00" : "#D1FAE5",
    goodBorder: highContrastMode ? "#FFFF00" : "#6EE7B7",
    danger: highContrastMode ? "#FFFF00" : "#DC2626",
  };

  // "today" in your sample is Jan 25 (hard-coded just like your web code)
  const todayPrefix = /^Jan 25/;

  const todaysTasks = useMemo(() => allTasks.filter((t) => todayPrefix.test(t.time)), [allTasks]);
  const pendingCount = useMemo(() => todaysTasks.filter((t) => !t.completed).length, [todaysTasks]);
  const completedCount = useMemo(() => todaysTasks.filter((t) => t.completed).length, [todaysTasks]);

  const getTasksForDate = (day: number, monthIndex: number) => {
    const date = getMonthYear(monthIndex);
    const monthStr = monthNames[date.getMonth()];

    return allTasks.filter((task) => {
      const m = task.time.match(/^([A-Z][a-z]{2}) (\d{1,2})/);
      if (!m) return false;
      const taskMonth = m[1];
      const taskDay = parseInt(m[2], 10);
      return taskMonth === monthStr && taskDay === day;
    });
  };

  const handleAddTask = () => router.push("/add-task");

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);

    const timeMatch = task.time.match(/(.+) at (.+)/);
    const extractedDate = timeMatch ? timeMatch[1] : "";
    const extractedTime = timeMatch ? timeMatch[2] : "";

    setEditTitle(task.title);
    setEditDate(extractedDate);
    setEditTime(extractedTime);
    setEditNotes("");
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedTask) deleteTask(selectedTask.id);
    setShowDeleteModal(false);
    setSelectedTask(null);
  };

  const saveEdit = () => {
    if (selectedTask && editTitle.trim() && editDate.trim() && editTime.trim()) {
      updateTask(selectedTask.id, {
        title: editTitle.trim(),
        time: formatDateTime(editDate.trim(), editTime.trim()),
      });
      setShowEditModal(false);
      setSelectedTask(null);
    }
  };

  const TaskRow = ({ task }: { task: Task }) => {
    const completed = task.completed;

    return (
      <View
        style={[
          styles.taskRow,
          {
            borderColor: completed ? (highContrastMode ? colors.border : colors.goodBorder) : colors.border,
            backgroundColor: completed ? (highContrastMode ? colors.goodBg : colors.goodBg) : highContrastMode ? colors.cardAlt : colors.card,
          },
        ]}
      >
        {/* Checkbox */}
        <Pressable
          onPress={() => toggleTask(task.id)}
          style={[
            styles.check,
            {
              borderColor: completed ? (highContrastMode ? "#000" : "#10B981") : highContrastMode ? colors.border : "#D1D5DB",
              backgroundColor: completed ? (highContrastMode ? "#000" : "#10B981") : highContrastMode ? "#3a3a3a" : "#fff",
            },
          ]}
        >
          {completed ? <Text style={{ color: highContrastMode ? "#FFFF00" : "#fff", fontWeight: "900" }}>✓</Text> : null}
        </Pressable>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.taskTitle,
              {
                color: completed ? (highContrastMode ? "#000" : colors.sub) : colors.title,
                textDecorationLine: completed ? "line-through" : "none",
              },
            ]}
          >
            {task.title}
          </Text>
          <Text style={[styles.taskTime, { color: highContrastMode ? "#fff" : colors.sub }]}>{task.time}</Text>
        </View>

        {/* Menu button */}
        <Pressable onPress={() => setOpenMenuId(openMenuId === task.id ? null : task.id)} style={styles.menuBtn}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: colors.primary }}>⋯</Text>
        </Pressable>

        {/* Menu (RN overlay) */}
        {openMenuId === task.id ? (
          <View style={[styles.menu, { backgroundColor: highContrastMode ? "#2a2a2a" : "#fff", borderColor: colors.border }]}>
            <Pressable onPress={() => handleEditClick(task)} style={styles.menuItem}>
              <Text style={{ color: highContrastMode ? colors.primary : "#101828", fontWeight: "800" }}>Edit Task</Text>
            </Pressable>
            <Pressable onPress={() => handleDeleteClick(task)} style={styles.menuItem}>
              <Text style={{ color: highContrastMode ? colors.primary : "#DC2626", fontWeight: "800" }}>Delete Task</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/tasks")} style={styles.backBtn}>
              <Text style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? "#fff" : "#101828" }}>←</Text>
            </Pressable>

            <View
              style={[
                styles.headerIcon,
                { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" },
              ]}
            >
              <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>✅</Text>
            </View>

            <View>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Today&apos;s Tasks</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Your daily care routine</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Back card */}
          <Pressable
            onPress={() => router.push("/tasks")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.95 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : "#101828" }}>
              ← Back to Tasks & Scheduling
            </Text>
          </Pressable>

          {/* Main card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Title row + Add */}
            <View style={styles.topRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bigTitle, { color: colors.title }]}>Today&apos;s Tasks</Text>
                <Text style={[styles.counts, { color: colors.sub }]}>
                  <Text style={{ color: colors.primary, fontWeight: "900" }}>{pendingCount} </Text>
                  pending • <Text style={{ fontWeight: "900" }}>{completedCount}</Text> completed
                </Text>
              </View>

              <Pressable
                onPress={handleAddTask}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ color: colors.primaryText, fontWeight: "900" }}>+ Add</Text>
              </Pressable>
            </View>

            {/* Toggle */}
            <View style={styles.toggleRow}>
              <Pressable onPress={() => setView("schedule")} style={styles.toggleItem}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: view === "schedule" ? colors.primary : "transparent" },
                  ]}
                />
                <Text style={{ fontWeight: "900", color: view === "schedule" ? colors.primary : colors.muted }}>
                  Schedule
                </Text>
              </Pressable>

              <Pressable onPress={() => setView("calendar")} style={styles.toggleItem}>
                <Text style={{ fontWeight: "900", color: view === "calendar" ? colors.primary : colors.muted }}>
                  Calendar
                </Text>
              </Pressable>
            </View>

            {/* Schedule */}
            {view === "schedule" ? (
              <View style={{ gap: 10 }}>
                {todaysTasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
                {todaysTasks.length === 0 ? (
                  <Text style={{ textAlign: "center", paddingVertical: 18, color: colors.sub, fontWeight: "800" }}>
                    No tasks for today
                  </Text>
                ) : null}
              </View>
            ) : (
              <View>
                {/* Month nav */}
                <View style={styles.monthRow}>
                  <Pressable
                    onPress={() => {
                      if (currentMonth === -1) return;
                      setCurrentMonth((m) => Math.max(-1, m - 1));
                      setSelectedDate(null);
                    }}
                    style={styles.monthBtn}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "900", color: currentMonth === -1 ? "#888" : colors.title }}>
                      ‹
                    </Text>
                  </Pressable>

                  <Text style={[styles.monthTitle, { color: colors.title }]}>
                    {getMonthYear(currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </Text>

                  <Pressable
                    onPress={() => {
                      if (currentMonth === 12) return;
                      setCurrentMonth((m) => Math.min(12, m + 1));
                      setSelectedDate(null);
                    }}
                    style={styles.monthBtn}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "900", color: currentMonth === 12 ? "#888" : colors.title }}>
                      ›
                    </Text>
                  </Pressable>
                </View>

                {/* Day headers */}
                <View style={styles.weekRow}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <Text key={d} style={[styles.weekDay, { color: colors.sub }]}>{d}</Text>
                  ))}
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                  {generateCalendarDays(currentMonth).map((day, idx) => {
                    if (day === null) return <View key={`e-${idx}`} style={styles.dayCell} />;

                    const tasksForDay = getTasksForDate(day, currentMonth);
                    const hasMultiple = tasksForDay.length > 1;
                    const isToday = currentMonth === 0 && day === 25;
                    const isSelected = selectedDate === day;

                    const bg =
                      isSelected
                        ? highContrastMode
                          ? "#FFFF00"
                          : "#EFF6FF"
                        : isToday
                          ? highContrastMode
                            ? "#2a2a2a"
                            : "#EFF6FF"
                          : highContrastMode
                            ? "#2a2a2a"
                            : "#FFFFFF";

                    const border =
                      isSelected || isToday
                        ? colors.primary
                        : highContrastMode
                          ? "#3a3a3a"
                          : colors.border;

                    const dayColor =
                      isSelected
                        ? highContrastMode
                          ? "#000"
                          : colors.primary
                        : isToday
                          ? colors.primary
                          : highContrastMode
                            ? "#fff"
                            : "#101828";

                    return (
                      <Pressable
                        key={`d-${currentMonth}-${day}`}
                        onPress={() => setSelectedDate(day)}
                        style={({ pressed }) => [
                          styles.dayCell,
                          { backgroundColor: bg, borderColor: border },
                          pressed && { opacity: 0.95 },
                        ]}
                      >
                        <Text style={{ fontWeight: "900", color: dayColor }}>{day}</Text>

                        {/* dots */}
                        {tasksForDay.length > 0 ? (
                          <View style={styles.dotsRow}>
                            {(hasMultiple ? [0, 1, 2] : [0]).map((n) => (
                              <View key={n} style={[styles.dotSmall, { backgroundColor: colors.primary }]} />
                            ))}
                          </View>
                        ) : null}

                        {/* +N */}
                        {hasMultiple ? (
                          <View style={[styles.plusBadge, { borderColor: colors.primary, backgroundColor: bg }]}>
                            <Text style={{ fontSize: 10, fontWeight: "900", color: colors.primary }}>
                              +{tasksForDay.length - 1}
                            </Text>
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Tasks for selected date */}
                {selectedDate !== null ? (
                  <View style={{ marginTop: 16, gap: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "900", color: colors.title }}>
                      Tasks for {monthNames[getMonthYear(currentMonth).getMonth()]} {selectedDate}
                    </Text>

                    {getTasksForDate(selectedDate, currentMonth).length === 0 ? (
                      <Text style={{ color: colors.sub, fontWeight: "800", paddingVertical: 8 }}>
                        No tasks scheduled
                      </Text>
                    ) : (
                      getTasksForDate(selectedDate, currentMonth).map((t) => <TaskRow key={t.id} task={t} />)
                    )}
                  </View>
                ) : null}
              </View>
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Tap outside to close any open menu */}
        {openMenuId !== null ? (
          <Pressable style={styles.menuBackdrop} onPress={() => setOpenMenuId(null)} />
        ) : null}

        {/* Delete modal */}
        <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <Text style={{ fontSize: 20, fontWeight: "900", color: colors.title }}>Delete Task</Text>
                <Pressable onPress={() => setShowDeleteModal(false)}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.sub }}>✕</Text>
                </Pressable>
              </View>

              <Text style={{ color: colors.sub, fontWeight: "700", marginBottom: 14 }}>
                Are you sure you want to delete this task? This action cannot be undone.
              </Text>

              <View style={[styles.warnBox, { borderColor: colors.border, backgroundColor: highContrastMode ? "#2a2a2a" : "#FEF2F2" }]}>
                <Text style={{ fontWeight: "900", color: colors.title, marginBottom: 4 }}>
                  {selectedTask?.title ?? ""}
                </Text>
                <Text style={{ color: colors.sub, fontWeight: "700" }}>This task will be permanently removed.</Text>
              </View>

              <View style={{ gap: 10, marginTop: 14 }}>
                <Pressable
                  onPress={confirmDelete}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: highContrastMode ? "#FFFF00" : "#DC2626" },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>Delete Task</Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowDeleteModal(false)}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    { borderColor: colors.border, backgroundColor: highContrastMode ? "#2a2a2a" : "#fff" },
                    pressed && { opacity: 0.92 },
                  ]}
                >
                  <Text style={{ color: colors.title, fontWeight: "900" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit modal */}
        <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: "900", color: colors.title }}>Edit Task</Text>
                  <Text style={{ color: colors.sub, fontWeight: "700" }}>Update your task details and schedule.</Text>
                </View>
                <Pressable onPress={() => setShowEditModal(false)}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.sub }}>✕</Text>
                </Pressable>
              </View>

              <View style={{ gap: 12, marginTop: 12 }}>
                <View>
                  <Text style={[styles.label, { color: colors.title }]}>Task Title *</Text>
                  <TextInput
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="Task title"
                    placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                    style={[
                      styles.input,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                        borderColor: colors.border,
                        color: colors.title,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.label, { color: colors.title }]}>Date *</Text>
                  <TextInput
                    value={editDate}
                    onChangeText={setEditDate}
                    placeholder="Jan 25, 2026"
                    placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                    style={[
                      styles.input,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                        borderColor: colors.border,
                        color: colors.title,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.label, { color: colors.title }]}>Time *</Text>
                  <TextInput
                    value={editTime}
                    onChangeText={setEditTime}
                    placeholder="8:00 AM"
                    placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                    style={[
                      styles.input,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                        borderColor: colors.border,
                        color: colors.title,
                      },
                    ]}
                  />
                </View>

                <View>
                  <Text style={[styles.label, { color: colors.title }]}>Notes (Optional)</Text>
                  <TextInput
                    value={editNotes}
                    onChangeText={setEditNotes}
                    placeholder="Add any additional details..."
                    placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                    multiline
                    style={[
                      styles.textarea,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                        borderColor: colors.border,
                        color: colors.title,
                      },
                    ]}
                  />
                </View>

                <View style={{ gap: 10, marginTop: 2 }}>
                  <Pressable
                    onPress={saveEdit}
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" },
                      pressed && { opacity: 0.92 },
                    ]}
                  >
                    <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>Save Changes</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setShowEditModal(false)}
                    style={({ pressed }) => [
                      styles.secondaryBtn,
                      { borderColor: colors.border, backgroundColor: highContrastMode ? "#2a2a2a" : "#fff" },
                      pressed && { opacity: 0.92 },
                    ]}
                  >
                    <Text style={{ color: colors.title, fontWeight: "900" }}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: { borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "900" },
  headerSub: { marginTop: 2, fontSize: 13, fontWeight: "700" },

  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0, gap: 12 },

  backCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  card: { borderWidth: 1, borderRadius: 16, padding: 16 },

  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  bigTitle: { fontSize: 20, fontWeight: "900", marginBottom: 4 },
  counts: { fontSize: 13, fontWeight: "800" },

  addBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignSelf: "flex-start" },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 14 },
  toggleItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  taskRow: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    position: "relative",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  taskTitle: { fontSize: 14, fontWeight: "900", marginBottom: 4 },
  taskTime: { fontSize: 12, fontWeight: "700" },

  menuBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  menu: {
    position: "absolute",
    right: 8,
    top: 38,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 150,
    zIndex: 50,
  },
  menuItem: { paddingHorizontal: 14, paddingVertical: 12 },

  menuBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  monthBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  monthTitle: { fontSize: 16, fontWeight: "900" },

  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  weekDay: { width: "14.285%", textAlign: "center", fontSize: 12, fontWeight: "800" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dayCell: {
    width: "13.2%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dotsRow: { position: "absolute", bottom: 6, flexDirection: "row", gap: 3 },
  dotSmall: { width: 6, height: 6, borderRadius: 3 },
  plusBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 420, borderWidth: 1, borderRadius: 18, padding: 16 },
  modalHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },

  warnBox: { borderWidth: 1, borderRadius: 14, padding: 14 },

  label: { fontSize: 13, fontWeight: "900", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontWeight: "800" },
  textarea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, minHeight: 86, fontWeight: "800" },

  primaryBtn: { borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  secondaryBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
});
