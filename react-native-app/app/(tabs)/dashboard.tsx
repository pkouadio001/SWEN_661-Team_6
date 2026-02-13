<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

type CardProps = {
  title: string;
  subtitle: string;
  to: string;
  icon: string;
  badge?: number;
};

type NavItemProps = {
  label: string;
  icon: string;
  to?: string;
  active?: boolean;
  badge?: number;
  onPress?: () => void;
  color?: string;
};

export default function DashboardScreen() {
  const pathname = usePathname();
  const userName = "John Doe";

  const { highContrastMode, resetTheme } = useTheme();
  const { getUnreadCount } = useMessages();

  const unread = getUnreadCount();
  const alertCount = 5;

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#4A5565",
      muted: highContrastMode ? "#FFFF00" : "#6B7280",
      navBg: highContrastMode ? "#000000" : "#FFFFFF",
      navActive: highContrastMode ? "#FFFF00" : "#155DFC",
      navInactive: highContrastMode ? "#FFFFFF" : "#6B7280",
      badge: highContrastMode ? "#FFFF00" : "#EF4444",
    }),
    [highContrastMode]
  );

  const go = (path: string) => router.push(path);

  const handleLogout = async () => {
    try {
      // If you only want to clear auth keys, DON'T clear everything—remove this and clear specific keys instead.
      await AsyncStorage.clear();

      // ✅ Ensure High Contrast is OFF for login/register screens
      await resetTheme();
    } finally {
      router.replace("/");
    }
  };

  const Card = ({ title, subtitle, to, icon, badge }: CardProps) => (
    <Pressable
      onPress={() => go(to)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.96 },
      ]}
    >
      <View style={styles.cardInner}>
        <View style={[styles.iconTile, { backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF" }]}>
          <Text style={[styles.iconText, { color: highContrastMode ? "#FFFF00" : "#155DFC" }]}>{icon}</Text>
        </View>

        {badge && badge > 0 ? (
          <View style={[styles.cardBadge, { backgroundColor: colors.badge }]}>
            <Text style={[styles.cardBadgeText, { color: highContrastMode ? "#000" : "#fff" }]}>
              {badge > 99 ? "99+" : badge}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.cardTitle, { color: colors.title }]}>{title}</Text>
        <Text style={[styles.cardSub, { color: colors.muted }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );

  const NavItem = ({ label, icon, to, active, badge, onPress, color }: NavItemProps) => {
    const iconColor = color ?? (active ? colors.navActive : colors.navInactive);

    return (
      <Pressable onPress={onPress ?? (() => to && go(to))} style={styles.navItem}>
        <View style={styles.navIconWrap}>
          <Text style={[styles.navIcon, { color: iconColor }]}>{icon}</Text>

          {badge && badge > 0 ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: label === "Alerts" && highContrastMode ? "#FFFF00" : "#EF4444" },
              ]}
            >
              <Text style={[styles.badgeText, { color: label === "Alerts" && highContrastMode ? "#000" : "#fff" }]}>
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.navLabel, { color: iconColor }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.logo, { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" }]}>
              <Text style={[styles.logoText, { color: highContrastMode ? "#000" : "#fff" }]}>❤</Text>
            </View>

            <View>
              <Text style={[styles.appTitle, { color: colors.title }]}>CareConnect</Text>
              <Text style={[styles.welcome, { color: colors.sub }]}>Welcome, {userName}</Text>
            </View>
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            <Card title="Tasks & Scheduling" subtitle="4 tasks today" to="/tasks" icon="🗓️" />
            <Card title="Notes & Health Logs" subtitle="3 recent logs" to="/health" icon="📝" />
            <Card title="Communication & Safety" subtitle={`${unread} unread`} to="/communication" icon="💬" badge={unread} />
            <Card title="Notifications & Reminders" subtitle="5 active reminders" to="/alerts" icon="🔔" badge={alertCount} />
            <Card title="Patient Information" subtitle="Medical details" to="/patient-info" icon="🧾" />
            <Card title="Profile & Settings" subtitle="Settings" to="/profile" icon="⚙️" />
          </View>

          <View style={{ height: 88 }} />
        </ScrollView>

        {/* Bottom Nav */}
        <View style={[styles.bottomNav, { backgroundColor: colors.navBg, borderTopColor: colors.border }]}>
          <View style={styles.bottomNavRow}>
            <NavItem label="Tasks" icon="✅" to="/tasks" active={pathname === "/tasks"} />
            <NavItem label="Health" icon="❤" to="/health" active={pathname === "/health"} />
            <NavItem label="Messages" icon="✉️" to="/messages" active={pathname === "/messages"} badge={unread} />
            <NavItem label="Alerts" icon="🔔" to="/alerts" active={pathname === "/alerts"} badge={alertCount} />
            <NavItem label="Profile" icon="👤" to="/profile" active={pathname === "/profile"} />

            {/* 🔴 Logoff */}
            <NavItem label="Logoff" icon="⎋" onPress={handleLogout} color="#DC2626" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  logo: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 22, fontWeight: "900" },

  appTitle: { fontSize: 22, fontWeight: "900" },
  welcome: { marginTop: 2, fontSize: 14, fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    alignSelf: "center",
    maxWidth: 680,
    width: "100%",
  },

  card: {
    width: "48%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    position: "relative",
  },
  cardInner: { alignItems: "center" },

  iconTile: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  iconText: { fontSize: 20, fontWeight: "900" },

  cardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBadgeText: { fontSize: 10, fontWeight: "900" },

  cardTitle: { fontSize: 14, fontWeight: "900", textAlign: "center", marginBottom: 4 },
  cardSub: { fontSize: 12, fontWeight: "700", textAlign: "center" },

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
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

type CardProps = {
  title: string;
  subtitle: string;
  to: string;
  icon: string;
  badge?: number;
};

type NavItemProps = {
  label: string;
  icon: string;
  to?: string;
  active?: boolean;
  badge?: number;
  onPress?: () => void;
  color?: string;
};

export default function DashboardScreen() {
  const pathname = usePathname();
  const userName = "John Doe";

  const { highContrastMode, resetTheme } = useTheme();
  const { getUnreadCount } = useMessages();

  const unread = getUnreadCount();
  const alertCount = 5;

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#4A5565",
      muted: highContrastMode ? "#FFFF00" : "#6B7280",
      navBg: highContrastMode ? "#000000" : "#FFFFFF",
      navActive: highContrastMode ? "#FFFF00" : "#155DFC",
      navInactive: highContrastMode ? "#FFFFFF" : "#6B7280",
      badge: highContrastMode ? "#FFFF00" : "#EF4444",
    }),
    [highContrastMode]
  );

  const go = (path: string) => router.push(path);

  const handleLogout = async () => {
    try {
      // If you only want to clear auth keys, DON'T clear everything—remove this and clear specific keys instead.
      await AsyncStorage.clear();

      // ✅ Ensure High Contrast is OFF for login/register screens
      await resetTheme();
    } finally {
      router.replace("/");
    }
  };

  const Card = ({ title, subtitle, to, icon, badge }: CardProps) => (
    <Pressable
      onPress={() => go(to)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.96 },
      ]}
    >
      <View style={styles.cardInner}>
        <View style={[styles.iconTile, { backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF" }]}>
          <Text style={[styles.iconText, { color: highContrastMode ? "#FFFF00" : "#155DFC" }]}>{icon}</Text>
        </View>

        {badge && badge > 0 ? (
          <View style={[styles.cardBadge, { backgroundColor: colors.badge }]}>
            <Text style={[styles.cardBadgeText, { color: highContrastMode ? "#000" : "#fff" }]}>
              {badge > 99 ? "99+" : badge}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.cardTitle, { color: colors.title }]}>{title}</Text>
        <Text style={[styles.cardSub, { color: colors.muted }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );

  const NavItem = ({ label, icon, to, active, badge, onPress, color }: NavItemProps) => {
    const iconColor = color ?? (active ? colors.navActive : colors.navInactive);

    return (
      <Pressable onPress={onPress ?? (() => to && go(to))} style={styles.navItem}>
        <View style={styles.navIconWrap}>
          <Text style={[styles.navIcon, { color: iconColor }]}>{icon}</Text>

          {badge && badge > 0 ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: label === "Alerts" && highContrastMode ? "#FFFF00" : "#EF4444" },
              ]}
            >
              <Text style={[styles.badgeText, { color: label === "Alerts" && highContrastMode ? "#000" : "#fff" }]}>
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.navLabel, { color: iconColor }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.logo, { backgroundColor: highContrastMode ? "#FFFF00" : "#155DFC" }]}>
              <Text style={[styles.logoText, { color: highContrastMode ? "#000" : "#fff" }]}>❤</Text>
            </View>

            <View>
              <Text style={[styles.appTitle, { color: colors.title }]}>CareConnect</Text>
              <Text style={[styles.welcome, { color: colors.sub }]}>Welcome, {userName}</Text>
            </View>
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            <Card title="Tasks & Scheduling" subtitle="4 tasks today" to="/tasks" icon="🗓️" />
            <Card title="Notes & Health Logs" subtitle="3 recent logs" to="/health" icon="📝" />
            <Card title="Communication & Safety" subtitle={`${unread} unread`} to="/communication" icon="💬" badge={unread} />
            <Card title="Notifications & Reminders" subtitle="5 active reminders" to="/alerts" icon="🔔" badge={alertCount} />
            <Card title="Patient Information" subtitle="Medical details" to="/patient-info" icon="🧾" />
            <Card title="Profile & Settings" subtitle="Settings" to="/profile" icon="⚙️" />
          </View>

          <View style={{ height: 88 }} />
        </ScrollView>

        {/* Bottom Nav */}
        <View style={[styles.bottomNav, { backgroundColor: colors.navBg, borderTopColor: colors.border }]}>
          <View style={styles.bottomNavRow}>
            <NavItem label="Tasks" icon="✅" to="/tasks" active={pathname === "/tasks"} />
            <NavItem label="Health" icon="❤" to="/health" active={pathname === "/health"} />
            <NavItem label="Messages" icon="✉️" to="/messages" active={pathname === "/messages"} badge={unread} />
            <NavItem label="Alerts" icon="🔔" to="/alerts" active={pathname === "/alerts"} badge={alertCount} />
            <NavItem label="Profile" icon="👤" to="/profile" active={pathname === "/profile"} />

            {/* 🔴 Logoff */}
            <NavItem label="Logoff" icon="⎋" onPress={handleLogout} color="#DC2626" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  logo: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 22, fontWeight: "900" },

  appTitle: { fontSize: 22, fontWeight: "900" },
  welcome: { marginTop: 2, fontSize: 14, fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    alignSelf: "center",
    maxWidth: 680,
    width: "100%",
  },

  card: {
    width: "48%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    position: "relative",
  },
  cardInner: { alignItems: "center" },

  iconTile: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  iconText: { fontSize: 20, fontWeight: "900" },

  cardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBadgeText: { fontSize: 10, fontWeight: "900" },

  cardTitle: { fontSize: 14, fontWeight: "900", textAlign: "center", marginBottom: 4 },
  cardSub: { fontSize: 12, fontWeight: "700", textAlign: "center" },

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
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
