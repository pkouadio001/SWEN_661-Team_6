<<<<<<< HEAD
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const { highContrastMode, setHighContrastMode } = useTheme();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "Jdoe@hotmail.com",
    username: "Jdoe",
    role: "Care Recipient",
  });

  const [currentPin, setCurrentPin] = useState(["", "", "", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);

  // ✅ Refs for focusing PIN inputs (RN replacement for document.getElementById)
  const currentRefs = useRef<Array<TextInput | null>>([]);
  const newRefs = useRef<Array<TextInput | null>>([]);
  const confirmRefs = useRef<Array<TextInput | null>>([]);

  const styles = useMemo(() => makeStyles(highContrastMode), [highContrastMode]);

  const handleLogout = () => {
    // Clear auth here if you have it
    router.replace("/"); // ✅ better than push for logout
  };

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => setIsEditingProfile(false);
  const handleCancelEdit = () => setIsEditingProfile(false);

  const getRefs = (type: "current" | "new" | "confirm") => {
    if (type === "current") return currentRefs;
    if (type === "new") return newRefs;
    return confirmRefs;
  };

  const getSetter = (type: "current" | "new" | "confirm") => {
    if (type === "current") return setCurrentPin;
    if (type === "new") return setNewPin;
    return setConfirmPin;
  };

  const getPinArray = (type: "current" | "new" | "confirm") => {
    if (type === "current") return currentPin;
    if (type === "new") return newPin;
    return confirmPin;
  };

  const handlePinChange = (index: number, value: string, type: "current" | "new" | "confirm") => {
    // only a single digit
    if (value.length > 1) value = value.slice(-1);
    if (value !== "" && !/^\d$/.test(value)) return;

    const setter = getSetter(type);
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const refs = getRefs(type).current;
      refs[index + 1]?.focus();
    }
  };

  const handlePinKeyPress = (
    key: string,
    index: number,
    type: "current" | "new" | "confirm"
  ) => {
    if (key !== "Backspace") return;

    const pin = getPinArray(type);
    // If current box empty, go back and focus previous
    if (pin[index] === "" && index > 0) {
      const refs = getRefs(type).current;
      refs[index - 1]?.focus();
    }
  };

  const resetPins = () => {
    setCurrentPin(["", "", "", "", "", ""]);
    setNewPin(["", "", "", "", "", ""]);
    setConfirmPin(["", "", "", "", "", ""]);
  };

  const handleSavePin = () => {
    // Validate here: currentPin, newPin, confirmPin etc.
    setIsChangingPin(false);
    resetPins();
  };

  const handleCancelPin = () => {
    setIsChangingPin(false);
    resetPins();
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.iconBtn}>
              <Text style={styles.iconText}>←</Text>
            </Pressable>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <View>
              <Text style={styles.title}>Profile & Settings</Text>
              <Text style={styles.subtitle}>Manage your account</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back to Dashboard */}
        <Pressable onPress={() => router.push("/dashboard")} style={styles.primaryCardBtn}>
          <Text style={styles.primaryCardBtnText}>← Back to Dashboard</Text>
        </Pressable>

        {/* Profile Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Profile Information</Text>
              <Text style={styles.cardSubtitle}>Your personal details</Text>
            </View>
            <Pressable onPress={() => setIsEditingProfile(true)} style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.fullName}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.email}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.username}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.role}</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Manage your preferences</Text>

          {/* Change PIN */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Change PIN</Text>
            <Pressable onPress={() => setIsChangingPin(true)} style={styles.smallBtnAlt}>
              <Text style={styles.smallBtnAltText}>Update</Text>
            </Pressable>
          </View>

          {/* High Contrast Mode */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>High Contrast Mode</Text>
              <Text style={styles.settingSubText}>Enhance visibility</Text>
            </View>
            <Pressable
              onPress={() => setHighContrastMode(!highContrastMode)}
              style={[styles.switch, highContrastMode ? styles.switchOn : styles.switchOff]}
            >
              <View style={[styles.switchKnob, highContrastMode ? styles.knobOn : styles.knobOff]} />
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditingProfile} transparent animationType="fade" onRequestClose={handleCancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Profile Information</Text>
            <Text style={styles.modalSubtitle}>Your personal details</Text>

            <View style={styles.modalField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={profileData.fullName}
                onChangeText={(t) => handleProfileChange("fullName", t)}
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={profileData.email}
                onChangeText={(t) => handleProfileChange("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={profileData.username}
                onChangeText={(t) => handleProfileChange("username", t)}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{profileData.role}</Text>
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable onPress={handleSaveProfile} style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Save Changes</Text>
              </Pressable>
              <Pressable onPress={handleCancelEdit} style={styles.modalSecondaryBtn}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change PIN Modal */}
      <Modal visible={isChangingPin} transparent animationType="fade" onRequestClose={handleCancelPin}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <Text style={styles.modalSubtitle}>Enter current PIN and a new PIN</Text>

            <PinRow
              label="Current PIN"
              value={currentPin}
              type="current"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={currentRefs}
            />
            <PinRow
              label="New PIN"
              value={newPin}
              type="new"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={newRefs}
            />
            <PinRow
              label="Confirm New PIN"
              value={confirmPin}
              type="confirm"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={confirmRefs}
            />

            <View style={styles.modalBtnRow}>
              <Pressable onPress={handleCancelPin} style={styles.modalSecondaryBtn}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSavePin} style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function PinRow({
  label,
  value,
  type,
  styles,
  onChange,
  onKeyPress,
  refsArray,
}: {
  label: string;
  value: string[];
  type: "current" | "new" | "confirm";
  styles: any;
  onChange: (index: number, value: string, type: "current" | "new" | "confirm") => void;
  onKeyPress: (key: string, index: number, type: "current" | "new" | "confirm") => void;
  refsArray: React.MutableRefObject<Array<TextInput | null>>;
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pinRow}>
        {value.map((digit, index) => (
          <TextInput
            key={`${type}-${index}`}
            ref={(el) => (refsArray.current[index] = el)}
            value={digit}
            onChangeText={(t) => onChange(index, t, type)}
            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index, type)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.pinBox}
            textAlign="center"
          />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (hc: boolean) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: hc ? "#000" : "#F4F7FF",
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    iconBtn: { padding: 8 },
    iconText: { fontSize: 20, color: hc ? "#FFFF00" : "#101828" },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hc ? "#FFFF00" : "#475569",
    },
    avatarText: { fontSize: 18, color: hc ? "#000" : "#fff" },
    title: { fontSize: 18, fontWeight: "800", color: hc ? "#fff" : "#101828" },
    subtitle: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    content: { padding: 16, paddingBottom: 24, gap: 12 },

    primaryCardBtn: {
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    primaryCardBtnText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 16,
      gap: 12,
    },
    cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: "800", color: hc ? "#fff" : "#101828" },
    cardSubtitle: { fontSize: 12, color: hc ? "#FFFF00" : "#6B7280", marginTop: 2 },

    smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    smallBtnText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    field: { gap: 6 },
    label: { fontSize: 12, fontWeight: "700", color: hc ? "#fff" : "#101828" },
    valueBox: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
    },
    valueText: { color: hc ? "#fff" : "#6B7280", fontWeight: "600" },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
    },
    settingText: { fontWeight: "800", color: hc ? "#fff" : "#101828" },
    settingSubText: { fontSize: 12, marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    smallBtnAlt: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#333" : "#fff",
    },
    smallBtnAltText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    switch: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: "center" },
    switchOn: { backgroundColor: "#FFFF00" },
    switchOff: { backgroundColor: "#D1D5DB" },
    switchKnob: { width: 20, height: 20, borderRadius: 10 },
    knobOn: { backgroundColor: "#000", alignSelf: "flex-end" },
    knobOff: { backgroundColor: "#fff", alignSelf: "flex-start" },

    logoutBtn: {
      marginTop: 4,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: hc ? "#FFFF00" : "#DC2626",
      alignItems: "center",
    },
    logoutText: { fontWeight: "900", color: hc ? "#000" : "#fff" },

    modalOverlay: {
      flex: 1,
      backgroundColor: hc ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 16,
    },
    modalCard: {
      borderRadius: 18,
      padding: 16,
      borderWidth: hc ? 2 : 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
    },
    modalTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalSubtitle: { marginTop: 4, color: hc ? "#FFFF00" : "#6B7280" },

    modalField: { marginTop: 12, gap: 6 },
    input: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F3F4F6",
      color: hc ? "#fff" : "#101828",
      fontWeight: "600",
    },

    modalBtnRow: { flexDirection: "row", gap: 10, marginTop: 16 },
    modalPrimaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
    },
    modalPrimaryText: { fontWeight: "900", color: hc ? "#000" : "#fff" },
    modalSecondaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
    },
    modalSecondaryText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    pinRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8 },
    pinBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F3F4F6",
      color: hc ? "#fff" : "#101828",
      fontSize: 18,
      fontWeight: "900",
    },
  });
=======
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const { highContrastMode, setHighContrastMode } = useTheme();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "Jdoe@hotmail.com",
    username: "Jdoe",
    role: "Care Recipient",
  });

  const [currentPin, setCurrentPin] = useState(["", "", "", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);

  // ✅ Refs for focusing PIN inputs (RN replacement for document.getElementById)
  const currentRefs = useRef<Array<TextInput | null>>([]);
  const newRefs = useRef<Array<TextInput | null>>([]);
  const confirmRefs = useRef<Array<TextInput | null>>([]);

  const styles = useMemo(() => makeStyles(highContrastMode), [highContrastMode]);

  const handleLogout = () => {
    // Clear auth here if you have it
    router.replace("/"); // ✅ better than push for logout
  };

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => setIsEditingProfile(false);
  const handleCancelEdit = () => setIsEditingProfile(false);

  const getRefs = (type: "current" | "new" | "confirm") => {
    if (type === "current") return currentRefs;
    if (type === "new") return newRefs;
    return confirmRefs;
  };

  const getSetter = (type: "current" | "new" | "confirm") => {
    if (type === "current") return setCurrentPin;
    if (type === "new") return setNewPin;
    return setConfirmPin;
  };

  const getPinArray = (type: "current" | "new" | "confirm") => {
    if (type === "current") return currentPin;
    if (type === "new") return newPin;
    return confirmPin;
  };

  const handlePinChange = (index: number, value: string, type: "current" | "new" | "confirm") => {
    // only a single digit
    if (value.length > 1) value = value.slice(-1);
    if (value !== "" && !/^\d$/.test(value)) return;

    const setter = getSetter(type);
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const refs = getRefs(type).current;
      refs[index + 1]?.focus();
    }
  };

  const handlePinKeyPress = (
    key: string,
    index: number,
    type: "current" | "new" | "confirm"
  ) => {
    if (key !== "Backspace") return;

    const pin = getPinArray(type);
    // If current box empty, go back and focus previous
    if (pin[index] === "" && index > 0) {
      const refs = getRefs(type).current;
      refs[index - 1]?.focus();
    }
  };

  const resetPins = () => {
    setCurrentPin(["", "", "", "", "", ""]);
    setNewPin(["", "", "", "", "", ""]);
    setConfirmPin(["", "", "", "", "", ""]);
  };

  const handleSavePin = () => {
    // Validate here: currentPin, newPin, confirmPin etc.
    setIsChangingPin(false);
    resetPins();
  };

  const handleCancelPin = () => {
    setIsChangingPin(false);
    resetPins();
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.iconBtn}>
              <Text style={styles.iconText}>←</Text>
            </Pressable>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <View>
              <Text style={styles.title}>Profile & Settings</Text>
              <Text style={styles.subtitle}>Manage your account</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back to Dashboard */}
        <Pressable onPress={() => router.push("/dashboard")} style={styles.primaryCardBtn}>
          <Text style={styles.primaryCardBtnText}>← Back to Dashboard</Text>
        </Pressable>

        {/* Profile Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Profile Information</Text>
              <Text style={styles.cardSubtitle}>Your personal details</Text>
            </View>
            <Pressable onPress={() => setIsEditingProfile(true)} style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.fullName}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.email}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.username}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{profileData.role}</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Manage your preferences</Text>

          {/* Change PIN */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Change PIN</Text>
            <Pressable onPress={() => setIsChangingPin(true)} style={styles.smallBtnAlt}>
              <Text style={styles.smallBtnAltText}>Update</Text>
            </Pressable>
          </View>

          {/* High Contrast Mode */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>High Contrast Mode</Text>
              <Text style={styles.settingSubText}>Enhance visibility</Text>
            </View>
            <Pressable
              onPress={() => setHighContrastMode(!highContrastMode)}
              style={[styles.switch, highContrastMode ? styles.switchOn : styles.switchOff]}
            >
              <View style={[styles.switchKnob, highContrastMode ? styles.knobOn : styles.knobOff]} />
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditingProfile} transparent animationType="fade" onRequestClose={handleCancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Profile Information</Text>
            <Text style={styles.modalSubtitle}>Your personal details</Text>

            <View style={styles.modalField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={profileData.fullName}
                onChangeText={(t) => handleProfileChange("fullName", t)}
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={profileData.email}
                onChangeText={(t) => handleProfileChange("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={profileData.username}
                onChangeText={(t) => handleProfileChange("username", t)}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{profileData.role}</Text>
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable onPress={handleSaveProfile} style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Save Changes</Text>
              </Pressable>
              <Pressable onPress={handleCancelEdit} style={styles.modalSecondaryBtn}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change PIN Modal */}
      <Modal visible={isChangingPin} transparent animationType="fade" onRequestClose={handleCancelPin}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <Text style={styles.modalSubtitle}>Enter current PIN and a new PIN</Text>

            <PinRow
              label="Current PIN"
              value={currentPin}
              type="current"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={currentRefs}
            />
            <PinRow
              label="New PIN"
              value={newPin}
              type="new"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={newRefs}
            />
            <PinRow
              label="Confirm New PIN"
              value={confirmPin}
              type="confirm"
              styles={styles}
              onChange={handlePinChange}
              onKeyPress={handlePinKeyPress}
              refsArray={confirmRefs}
            />

            <View style={styles.modalBtnRow}>
              <Pressable onPress={handleCancelPin} style={styles.modalSecondaryBtn}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSavePin} style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function PinRow({
  label,
  value,
  type,
  styles,
  onChange,
  onKeyPress,
  refsArray,
}: {
  label: string;
  value: string[];
  type: "current" | "new" | "confirm";
  styles: any;
  onChange: (index: number, value: string, type: "current" | "new" | "confirm") => void;
  onKeyPress: (key: string, index: number, type: "current" | "new" | "confirm") => void;
  refsArray: React.MutableRefObject<Array<TextInput | null>>;
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pinRow}>
        {value.map((digit, index) => (
          <TextInput
            key={`${type}-${index}`}
            ref={(el) => (refsArray.current[index] = el)}
            value={digit}
            onChangeText={(t) => onChange(index, t, type)}
            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index, type)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.pinBox}
            textAlign="center"
          />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (hc: boolean) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: hc ? "#000" : "#F4F7FF",
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    iconBtn: { padding: 8 },
    iconText: { fontSize: 20, color: hc ? "#FFFF00" : "#101828" },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hc ? "#FFFF00" : "#475569",
    },
    avatarText: { fontSize: 18, color: hc ? "#000" : "#fff" },
    title: { fontSize: 18, fontWeight: "800", color: hc ? "#fff" : "#101828" },
    subtitle: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    content: { padding: 16, paddingBottom: 24, gap: 12 },

    primaryCardBtn: {
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    primaryCardBtnText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 16,
      gap: 12,
    },
    cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: "800", color: hc ? "#fff" : "#101828" },
    cardSubtitle: { fontSize: 12, color: hc ? "#FFFF00" : "#6B7280", marginTop: 2 },

    smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    smallBtnText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    field: { gap: 6 },
    label: { fontSize: 12, fontWeight: "700", color: hc ? "#fff" : "#101828" },
    valueBox: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
    },
    valueText: { color: hc ? "#fff" : "#6B7280", fontWeight: "600" },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
    },
    settingText: { fontWeight: "800", color: hc ? "#fff" : "#101828" },
    settingSubText: { fontSize: 12, marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    smallBtnAlt: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#333" : "#fff",
    },
    smallBtnAltText: { fontWeight: "700", color: hc ? "#FFFF00" : "#101828" },

    switch: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: "center" },
    switchOn: { backgroundColor: "#FFFF00" },
    switchOff: { backgroundColor: "#D1D5DB" },
    switchKnob: { width: 20, height: 20, borderRadius: 10 },
    knobOn: { backgroundColor: "#000", alignSelf: "flex-end" },
    knobOff: { backgroundColor: "#fff", alignSelf: "flex-start" },

    logoutBtn: {
      marginTop: 4,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: hc ? "#FFFF00" : "#DC2626",
      alignItems: "center",
    },
    logoutText: { fontWeight: "900", color: hc ? "#000" : "#fff" },

    modalOverlay: {
      flex: 1,
      backgroundColor: hc ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 16,
    },
    modalCard: {
      borderRadius: 18,
      padding: 16,
      borderWidth: hc ? 2 : 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
    },
    modalTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalSubtitle: { marginTop: 4, color: hc ? "#FFFF00" : "#6B7280" },

    modalField: { marginTop: 12, gap: 6 },
    input: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F3F4F6",
      color: hc ? "#fff" : "#101828",
      fontWeight: "600",
    },

    modalBtnRow: { flexDirection: "row", gap: 10, marginTop: 16 },
    modalPrimaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
    },
    modalPrimaryText: { fontWeight: "900", color: hc ? "#000" : "#fff" },
    modalSecondaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
    },
    modalSecondaryText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    pinRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8 },
    pinBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F3F4F6",
      color: hc ? "#fff" : "#101828",
      fontSize: 18,
      fontWeight: "900",
    },
  });
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
