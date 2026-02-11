import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useScheduledAppointments } from "@/context/ScheduledAppointmentsContext";
import { useTasks } from "@/context/TasksContext";
import { useTheme } from "@/context/ThemeContext";

type UpcomingItem =
  | {
      type: "task";
      id: string;
      title: string;
      time: string; // expected YYYY-MM-DD
      completed: boolean;
    }
  | {
      type: "appointment";
      id: string;
      title: string;
      subtitle?: string;
      date: string; // expected YYYY-MM-DD
      time?: string;
    };

export default function TasksScreen() {
  const pathname = usePathname();
  const { highContrastMode } = useTheme();

  const { upcomingAppointmentsCount, allAppointments } = useScheduledAppointments();
  const { todaysPendingCount, todaysCompletedCount, allTasks } = useTasks();

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    card2: highContrastMode ? "#2a2a2a" : "#EFF6FF",
    card3: highContrastMode ? "#2a2a2a" : "#F0FDFA",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    text: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    brand: highContrastMode ? "#FFFF00" : "#155DFC",
    navInactive: highContrastMode ? "#FFFFFF" : "#6B7280",
    navActive: highContrastMode ? "#FFFF00" : "#155DFC",
    danger: highContrastMode ? "#FFFF00" : "#EF4444",
  };

  // Combine and sort tasks and appointments for the week
  const upcomingItems = useMemo<UpcomingItem[]>(() => {
    const items: UpcomingItem[] = [];

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const parseDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const isWithinWeek = (dateString: string) => {
      const d = parseDate(dateString);
      d.setHours(0, 0, 0, 0);

      const t = new Date(today);
      t.setHours(0, 0, 0, 0);

      const end = new Date(sevenDaysFromNow);
      end.setHours(23, 59, 59, 999);

      return d >= t && d <= end;
    };

    allTasks.forEach((task: any) => {
      // NOTE: your web code used task.time as a date string. If your RN task object is different,
      // change this to task.date (or whatever field is YYYY-MM-DD).
      if (task?.time && isWithinWeek(task.time)) {
        items.push({
          type: "task",
          id: `task-${task.id}`,
          title: task.title,
          time: task.time,
          completed: !!task.completed,
        });
      }
    });

    allAppointments.forEach((appt: any) => {
      if (appt?.date && isWithinWeek(appt.date)) {
        items.push({
          type: "appointment",
          id: `appointment-${appt.id}`,
          title: appt.title,
          subtitle: appt.subtitle,
          date: appt.date,
          time: appt.time,
        });
      }
    });

    return items.sort((a: any, b: any) => {
      const aDate = a.time || a.date;
      const bDate = b.time || b.date;
      return String(aDate).localeCompare(String(bDate));
    });
  }, [allTasks, allAppointments]);

  const go = (path: string) => router.push(path);

  const NavItem = ({
    label,
    to,
    active,
    badge,
  }: {
    label: string;
    to: string;
    active?: boolean;
    badge?: number;
  }) => (
    <Pressable onPress={() => go(to)} style={styles.navItem}>
      <Text style={[styles.navIcon, { color: active ? colors.navActive : colors.navInactive }]}>
        {label === "Home"
          ? "🏠"
          : label === "Tasks"
          ? "✅"
          : label === "Health"
          ? "❤"
          : label === "Messages"
          ? "✉️"
          : label === "Alerts"
          ? "🔔"
          : "👤"}
      </Text>

      {badge && badge > 0 ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: label === "Alerts" && highContrastMode ? "#FFFF00" : colors.danger },
          ]}
        >
          <Text style={[styles.badgeText, { color: label === "Alerts" && highContrastMode ? "#000" : "#fff" }]}>
            {badge}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.navLabel, { color: active ? colors.navActive : colors.navInactive }]}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: highContrastMode ? "#000" : "#fff", borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => go("/dashboard")} style={styles.backBtn}>
            <Text style={{ color: highContrastMode ? "#fff" : "#101828", fontSize: 18 }}>←</Text>
          </Pressable>

          <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" }]}>
            <Text style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}>🗓️</Text>
          </View>

          <View>
            <Text style={[styles.h1, { color: colors.text }]}>Tasks & Scheduling</Text>
            <Text style={[styles.h2, { color: colors.sub }]}>Manage your daily routine</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back to Dashboard */}
        <Pressable
          onPress={() => go("/dashboard")}
          style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.blockTitle, { color: colors.text }]}>← Back to Dashboard</Text>
        </Pressable>

        {/* Today's Tasks */}
        <Pressable
          onPress={() => go("/today-tasks")}
          style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.blockTitle, { color: colors.text }]}>Today's Tasks</Text>
          <Text style={[styles.blockSub, { color: colors.sub }]}>Your daily care routine</Text>
          <Text style={[styles.blockMeta, { color: colors.brand }]}>
            {todaysPendingCount} {todaysPendingCount === 1 ? "task" : "tasks"} pending
            <Text style={{ color: colors.sub }}> • </Text>
            <Text style={{ color: colors.sub }}>{todaysCompletedCount} completed</Text>
          </Text>
        </Pressable>

        {/* Upcoming Appointments */}
        <Pressable
          onPress={() => go("/upcoming-appointments")}
          style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.blockTitle, { color: colors.text }]}>Upcoming Appointments</Text>
          <Text style={[styles.blockSub, { color: colors.sub }]}>Your scheduled visits</Text>
          <Text style={[styles.blockMeta, { color: colors.brand }]}>{upcomingAppointmentsCount} appointments scheduled</Text>
        </Pressable>

        {/* Upcoming This Week */}
        <View style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming This Week</Text>

          <View style={{ gap: 10 }}>
            {upcomingItems.length > 0 ? (
              upcomingItems.map((item) => {
                const isTask = item.type === "task";
                const bg = isTask ? colors.card2 : colors.card3;

                return (
                  <View key={item.id} style={[styles.item, { backgroundColor: bg, borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                      {"subtitle" in item && item.subtitle ? (
                        <Text style={[styles.itemSub, { color: colors.sub }]}>{item.subtitle}</Text>
                      ) : null}
                      <Text style={[styles.itemSub, { color: colors.sub }]}>
                        {"date" in item ? item.date : item.time}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.pill,
                        {
                          backgroundColor: isTask
                            ? item.completed
                              ? highContrastMode
                                ? "#FFFF00"
                                : "#DCFCE7"
                              : highContrastMode
                                ? "#3a3a3a"
                                : "#DBEAFE"
                            : highContrastMode
                              ? "#FFFF00"
                              : "#CCFBF1",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "800",
                          color: isTask
                            ? item.completed
                              ? highContrastMode
                                ? "#000"
                                : "#166534"
                              : highContrastMode
                                ? "#FFFF00"
                                : "#1E40AF"
                            : highContrastMode
                              ? "#000"
                              : "#115E59",
                        }}
                      >
                        {isTask ? (item.completed ? "Completed" : "Pending") : "Appointment"}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: "center", paddingVertical: 12, color: colors.sub }}>
                No upcoming tasks or appointments
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.nav, { backgroundColor: highContrastMode ? "#000" : "#fff", borderTopColor: colors.border }]}>
        <View style={styles.navRow}>
          <NavItem label="Home" to="/dashboard" active={pathname === "/dashboard"} />
          <NavItem label="Tasks" to="/tasks" active={pathname === "/tasks"} />
          <NavItem label="Health" to="/health" active={pathname === "/health"} />
          <NavItem label="Messages" to="/messages" active={pathname === "/messages"} />
          <NavItem label="Alerts" to="/alerts" active={pathname === "/alerts"} badge={5} />
          <NavItem label="Profile" to="/profile" active={pathname === "/profile"} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  headerIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  h1: { fontSize: 18, fontWeight: "900" },
  h2: { fontSize: 12, fontWeight: "700", marginTop: 2 },

  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0, gap: 12 },

  block: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  blockTitle: { fontSize: 16, fontWeight: "900" },
  blockSub: { marginTop: 4, fontSize: 13, fontWeight: "700" },
  blockMeta: { marginTop: 10, fontSize: 13, fontWeight: "800" },

  sectionTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },

  item: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  itemTitle: { fontSize: 14, fontWeight: "900" },
  itemSub: { marginTop: 2, fontSize: 12, fontWeight: "700" },

  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },

  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  navItem: { width: 52, alignItems: "center", justifyContent: "center" },
  navIcon: { fontSize: 18, fontWeight: "900" },
  navLabel: { marginTop: 3, fontSize: 11, fontWeight: "800" },
  badge: {
    position: "absolute",
    top: -6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "900" },
});
