import { router, usePathname } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export default function HealthScreen() {
  const pathname = usePathname();
  const { highContrastMode } = useTheme();

  const colors = {
    bg: highContrastMode ? "#000000" : "#F6F9FF",
    card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
    border: highContrastMode ? "#FFFF00" : "#E5E7EB",
    title: highContrastMode ? "#FFFFFF" : "#101828",
    sub: highContrastMode ? "#FFFF00" : "#6B7280",
    iconStroke: highContrastMode ? "#000000" : "#FFFFFF",
    navBg: highContrastMode ? "#000000" : "#FFFFFF",
    navActive: highContrastMode ? "#FFFF00" : "#155DFC",
    navInactive: highContrastMode ? "#FFFFFF" : "#6B7280",
    dangerBadgeBg: highContrastMode ? "#FFFF00" : "#EF4444",
    dangerBadgeText: highContrastMode ? "#000000" : "#FFFFFF",
  };

  const go = (path: string) => router.push(path);

  const HeaderIcon = () => (
    <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? "#FFFF00" : "#00BBA7" }]}>
      {/* icon: activity/heartline */}
      <Text style={[styles.headerIconText, { color: highContrastMode ? "#000" : "#fff" }]}>❤</Text>
    </View>
  );

  const BigCard = ({
    title,
    subtitle,
    to,
    tint,
    icon,
  }: {
    title: string;
    subtitle: string;
    to: string;
    tint: string;
    icon: string;
  }) => (
    <Pressable
      onPress={() => go(to)}
      style={({ pressed }) => [
        styles.bigCard,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.96 },
      ]}
    >
      <View style={[styles.bigIcon, { backgroundColor: highContrastMode ? "#FFFF00" : tint }]}>
        <Text style={[styles.bigIconText, { color: highContrastMode ? "#000" : "#fff" }]}>{icon}</Text>
      </View>

      <Text style={[styles.bigTitle, { color: colors.title }]}>{title}</Text>
      <Text style={[styles.bigSub, { color: colors.sub }]}>{subtitle}</Text>
    </Pressable>
  );

  const NavItem = ({
    label,
    icon,
    to,
    active,
    badge,
  }: {
    label: string;
    icon: string;
    to: string;
    active?: boolean;
    badge?: number;
  }) => (
    <Pressable onPress={() => go(to)} style={styles.navItem}>
      <View style={styles.navIconWrap}>
        <Text style={[styles.navIcon, { color: active ? colors.navActive : colors.navInactive }]}>{icon}</Text>
        {badge && badge > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.dangerBadgeBg }]}>
            <Text style={[styles.badgeText, { color: colors.dangerBadgeText }]}>
              {badge > 99 ? "99+" : badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.navLabel, { color: active ? colors.navActive : colors.navInactive }]}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.navBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => go("/dashboard")} style={styles.backBtn}>
              <Text style={[styles.backText, { color: highContrastMode ? "#fff" : "#101828" }]}>←</Text>
            </Pressable>

            <HeaderIcon />

            <View>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Notes & Health Logs</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Track your health and notes</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Dashboard */}
          <Pressable
            onPress={() => go("/dashboard")}
            style={({ pressed }) => [
              styles.backCard,
              {
                backgroundColor: highContrastMode ? "#1a1a1a" : "#FFFFFF",
                borderColor: colors.border,
              },
              pressed && { opacity: 0.95 },
            ]}
          >
            <Text style={[styles.backCardText, { color: highContrastMode ? "#FFFF00" : "#101828" }]}>
              ← Back to Dashboard
            </Text>
          </Pressable>

          {/* Cards */}
          <BigCard
            title="Health Logs"
            subtitle="Recent vital measurements"
            to="/health-logs"
            tint="#00BBA7"
            icon="❤"
          />

          <BigCard
            title="Personal Notes"
            subtitle="Track your thoughts and symptoms"
            to="/personal-notes"
            tint="#155DFC"
            icon="📝"
          />

          <BigCard
            title="History"
            subtitle="Your complete health and notes timeline"
            to="/history"
            tint="#A855F7"
            icon="🕒"
          />

          <View style={{ height: 88 }} />
        </ScrollView>

        {/* Bottom Nav */}
        <View style={[styles.bottomNav, { backgroundColor: colors.navBg, borderTopColor: colors.border }]}>
          <View style={styles.bottomNavRow}>
            <NavItem label="Home" icon="🏠" to="/dashboard" active={pathname === "/dashboard"} />
            <NavItem label="Tasks" icon="✅" to="/tasks" active={pathname === "/tasks"} />
            <NavItem label="Health" icon="❤" to="/health" active={pathname === "/health"} />
            <NavItem label="Messages" icon="✉️" to="/messages" active={pathname === "/messages"} />
            <NavItem label="Alerts" icon="🔔" to="/alerts" active={pathname === "/alerts"} badge={5} />
            <NavItem label="Profile" icon="👤" to="/profile" active={pathname === "/profile"} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },

  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  backBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  backText: { fontSize: 20, fontWeight: "900" },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { fontSize: 20, fontWeight: "900" },

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
  backCardText: { fontSize: 14, fontWeight: "800" },

  bigCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  bigIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bigIconText: { fontSize: 26, fontWeight: "900" },

  bigTitle: { fontSize: 18, fontWeight: "900", marginBottom: 6 },
  bigSub: { fontSize: 13, fontWeight: "700", textAlign: "center" },

  bottomNav: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomNavRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  navItem: { alignItems: "center", width: 52 },
  navIconWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  navIcon: { fontSize: 20, fontWeight: "900" },
  navLabel: { marginTop: 4, fontSize: 11, fontWeight: "800" },

  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "900" },
});
