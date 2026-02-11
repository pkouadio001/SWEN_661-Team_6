import { useEmergencyContact } from "@/context/EmergencyContactContext";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
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

export default function CommunicationScreen() {
  const { highContrastMode } = useTheme();
  const { emergencyContactData, setEmergencyContactData } = useEmergencyContact();
  const { getUnreadCount } = useMessages();

  const [isEditingEmergencyContact, setIsEditingEmergencyContact] = useState(false);
  const [editFormData, setEditFormData] = useState(emergencyContactData);
  const [phoneError, setPhoneError] = useState("");

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      card2: highContrastMode ? "#2a2a2a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      text: highContrastMode ? "#FFFFFF" : "#101828",
      accent: highContrastMode ? "#FFFF00" : "#155DFC",
      purple: "#9333EA",
      danger: "#DC2626",
      dangerDark: "#B91C1C",
    }),
    [highContrastMode]
  );

  // Validate phone number - must be exactly 10 digits
  const isPhoneValid = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length === 10;
  };

  const onChangeField = (name: "name" | "phone", value: string) => {
    if (name === "phone") {
      if (value === "") {
        setPhoneError("");
      } else if (!isPhoneValid(value)) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEmergencyContact = () => {
    if (!isPhoneValid(editFormData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    setEmergencyContactData(editFormData);
    setIsEditingEmergencyContact(false);
  };

  const handleCancelEmergencyEdit = () => {
    setEditFormData(emergencyContactData);
    setPhoneError("");
    setIsEditingEmergencyContact(false);
  };

  const unread = getUnreadCount();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: highContrastMode ? "#000" : "#fff",
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? colors.accent : colors.title, fontWeight: "900", fontSize: 20 }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: colors.purple }]}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>💬</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>
                Communication & Safety
              </Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>
                Messages and emergency contacts
              </Text>
            </View>

            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Dashboard Button */}
          <Pressable
            onPress={() => router.push("/dashboard")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
              ← Back to Dashboard
            </Text>
          </Pressable>

          {/* Messages Card */}
          <Link href="/messages" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.bigCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.92 },
              ]}
            >
              <View style={{ alignItems: "center" }}>
                <View style={[styles.bigIcon, { backgroundColor: colors.purple }]}>
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 20 }}>✉️</Text>

                  {unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unread}</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.bigTitle, { color: colors.title }]}>Messages</Text>
                <Text style={[styles.bigSub, { color: colors.sub }]}>
                  Stay connected with your care team
                </Text>
              </View>
            </Pressable>
          </Link>

          {/* Safety Section */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <View>
                <Text style={[styles.sectionTitle, { color: colors.title }]}>Safety</Text>
                <Text style={[styles.sectionSub, { color: colors.sub }]}>Emergency contacts</Text>
              </View>

              <Pressable
                onPress={() => setIsEditingEmergencyContact(true)}
                style={({ pressed }) => [
                  styles.editBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={{ color: highContrastMode ? colors.accent : colors.title, fontWeight: "900" }}>
                  ✎ Edit
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 12, marginTop: 12 }}>
              {/* Primary Emergency Contact */}
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.rowCard,
                  { backgroundColor: colors.card2, borderColor: colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontSize: 18 }}>📞</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
                    {emergencyContactData.name}
                  </Text>
                  <Text style={{ fontWeight: "800", color: highContrastMode ? "#fff" : colors.sub }}>
                    {emergencyContactData.phone}
                  </Text>
                </View>
              </Pressable>

              {/* Emergency 911 */}
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.rowCard,
                  { backgroundColor: colors.card2, borderColor: highContrastMode ? "#EF4444" : colors.border },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={{ fontSize: 18 }}>🚨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
                    Emergency: 911
                  </Text>
                  <Text style={{ fontWeight: "800", color: highContrastMode ? "#fff" : colors.sub }}>
                    Police/Fire/EMS
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation */}
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

            {/* Active */}
            <Link href="/communication" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? colors.accent : "#155DFC", fontWeight: "900" }}>
                  Messages
                </Text>
                {unread > 0 && (
                  <View style={[styles.navBadge, { backgroundColor: highContrastMode ? "#DC2626" : "#EF4444" }]}>
                    <Text style={styles.navBadgeText}>{unread}</Text>
                  </View>
                )}
              </Pressable>
            </Link>

            <Link href="/alerts" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Alerts</Text>
              </Pressable>
            </Link>

            <Link href="/profile" asChild>
              <Pressable style={styles.navItem}>
                <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Edit Emergency Contact Modal */}
        <Modal
          visible={isEditingEmergencyContact}
          transparent
          animationType="fade"
          onRequestClose={handleCancelEmergencyEdit}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.card,
                  borderColor: highContrastMode ? colors.border : "transparent",
                  borderWidth: highContrastMode ? 2 : 0,
                },
              ]}
            >
              {/* Modal Header */}
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor: highContrastMode ? "#DC2626" : "#DC2626",
                  },
                ]}
              >
                <Text style={{ fontSize: 20, fontWeight: "900", color: highContrastMode ? colors.accent : "#fff" }}>
                  Edit Emergency Contact
                </Text>
                <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? colors.accent : "rgba(255,255,255,0.9)" }}>
                  Update your emergency contact information
                </Text>
              </View>

              {/* Modal Body */}
              <View style={styles.modalBody}>
                <Text style={[styles.label, { color: highContrastMode ? colors.accent : colors.title }]}>
                  Contact Name
                </Text>
                <TextInput
                  value={editFormData.name}
                  onChangeText={(t) => onChangeField("name", t)}
                  placeholder="Enter contact name"
                  placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                  style={[
                    styles.input,
                    {
                      backgroundColor: highContrastMode ? "#2a2a2a" : "#fff",
                      borderColor: colors.border,
                      color: colors.title,
                    },
                  ]}
                />

                <View style={{ height: 14 }} />

                <Text style={[styles.label, { color: highContrastMode ? colors.accent : colors.title }]}>
                  Phone Number
                </Text>
                <TextInput
                  value={editFormData.phone}
                  onChangeText={(t) => onChangeField("phone", t)}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor={highContrastMode ? "#777" : "#9CA3AF"}
                  keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                  style={[
                    styles.input,
                    {
                      backgroundColor: highContrastMode ? "#2a2a2a" : "#fff",
                      borderColor: phoneError ? "#EF4444" : colors.border,
                      color: colors.title,
                    },
                  ]}
                />
                {phoneError ? (
                  <Text style={{ marginTop: 8, fontWeight: "900", color: highContrastMode ? "#FCA5A5" : "#EF4444" }}>
                    {phoneError}
                  </Text>
                ) : null}
              </View>

              {/* Modal Footer */}
              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <Pressable
                  onPress={handleCancelEmergencyEdit}
                  style={({ pressed }) => [
                    styles.footerBtn,
                    { borderColor: colors.border },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={{ fontWeight: "900", color: highContrastMode ? colors.accent : colors.title }}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSaveEmergencyContact}
                  disabled={phoneError !== "" && editFormData.phone !== ""}
                  style={({ pressed }) => [
                    styles.footerBtnPrimary,
                    {
                      backgroundColor:
                        phoneError !== "" && editFormData.phone !== ""
                          ? highContrastMode
                            ? "#374151"
                            : "#D1D5DB"
                          : highContrastMode
                            ? colors.danger
                            : colors.danger,
                    },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "900",
                      color:
                        phoneError !== "" && editFormData.phone !== ""
                          ? highContrastMode
                            ? "#9CA3AF"
                            : "#6B7280"
                          : "#fff",
                    }}
                  >
                    Save Changes
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

  bigCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  bigIcon: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  bigTitle: { fontSize: 18, fontWeight: "900" },
  bigSub: { marginTop: 4, fontSize: 13, fontWeight: "800", textAlign: "center" },

  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

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

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "900" },
  sectionSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  editBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },

  rowCard: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
  navBadge: {
    position: "absolute",
    top: -2,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  navBadgeText: { color: "#fff", fontWeight: "900", fontSize: 10 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 700, borderRadius: 22, overflow: "hidden" },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 16 },
  modalBody: { padding: 16 },
  modalFooter: { borderTopWidth: 1, padding: 16, flexDirection: "row", gap: 12, justifyContent: "flex-end" },

  label: { fontSize: 13, fontWeight: "900", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, fontWeight: "800" },

  footerBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16 },
  footerBtnPrimary: { borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16 },
});
