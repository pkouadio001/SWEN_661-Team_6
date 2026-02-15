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
    <SafeAreaView 
      style={styles.screen}
      accessible={false}
    >
      {/* Header */}
      <View 
        style={styles.header}
        accessible={false}
      >
        <View 
          style={styles.headerRow}
          accessible={false}
        >
          <View 
            style={styles.headerLeft}
            accessible={false}
          >
            <Pressable 
              onPress={() => router.push("/dashboard")} 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Back to Dashboard"
              accessibilityHint="Navigate back to Dashboard"
              style={styles.iconBtn}
            >
              <Text 
                style={styles.iconText}
                accessible={false}
              >
                ←
              </Text>
            </Pressable>

            <View 
              style={styles.avatar}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Profile avatar"
            >
              <Text 
                style={styles.avatarText}
                accessible={false}
              >
                👤
              </Text>
            </View>

            <View accessible={false}>
              <Text 
                style={styles.title}
                accessible={true}
                accessibilityRole="header"
              >
                Profile & Settings
              </Text>
              <Text 
                style={styles.subtitle}
                accessible={true}
                accessibilityRole="text"
              >
                Manage your account
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {/* Back to Dashboard */}
        <Pressable 
          onPress={() => router.push("/dashboard")} 
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back to Dashboard"
          accessibilityHint="Navigate back to Dashboard"
          style={styles.primaryCardBtn}
        >
          <Text 
            style={styles.primaryCardBtnText}
            accessible={false}
          >
            ← Back to Dashboard
          </Text>
        </Pressable>

        {/* Profile Information Card */}
        <View 
          style={styles.card}
          accessible={false}
        >
          <View 
            style={styles.cardHeaderRow}
            accessible={false}
          >
            <View accessible={false}>
              <Text 
                style={styles.cardTitle}
                accessible={true}
                accessibilityRole="header"
              >
                Profile Information
              </Text>
              <Text 
                style={styles.cardSubtitle}
                accessible={true}
                accessibilityRole="text"
              >
                Your personal details
              </Text>
            </View>
            <Pressable 
              onPress={() => setIsEditingProfile(true)} 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              accessibilityHint="Edit your profile information"
              style={styles.smallBtn}
            >
              <Text 
                style={styles.smallBtnText}
                accessible={false}
              >
                Edit
              </Text>
            </Pressable>
          </View>

          <View 
            style={styles.field}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Full Name: ${profileData.fullName}`}
          >
            <Text 
              style={styles.label}
              accessible={false}
            >
              Full Name
            </Text>
            <View 
              style={styles.valueBox}
              accessible={false}
            >
              <Text 
                style={styles.valueText}
                accessible={false}
              >
                {profileData.fullName}
              </Text>
            </View>
          </View>

          <View 
            style={styles.field}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Email: ${profileData.email}`}
          >
            <Text 
              style={styles.label}
              accessible={false}
            >
              Email
            </Text>
            <View 
              style={styles.valueBox}
              accessible={false}
            >
              <Text 
                style={styles.valueText}
                accessible={false}
              >
                {profileData.email}
              </Text>
            </View>
          </View>

          <View 
            style={styles.field}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Username: ${profileData.username}`}
          >
            <Text 
              style={styles.label}
              accessible={false}
            >
              Username
            </Text>
            <View 
              style={styles.valueBox}
              accessible={false}
            >
              <Text 
                style={styles.valueText}
                accessible={false}
              >
                {profileData.username}
              </Text>
            </View>
          </View>

          <View 
            style={styles.field}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Role: ${profileData.role}`}
          >
            <Text 
              style={styles.label}
              accessible={false}
            >
              Role
            </Text>
            <View 
              style={styles.valueBox}
              accessible={false}
            >
              <Text 
                style={styles.valueText}
                accessible={false}
              >
                {profileData.role}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View 
          style={styles.card}
          accessible={false}
        >
          <Text 
            style={styles.cardTitle}
            accessible={true}
            accessibilityRole="header"
          >
            Settings
          </Text>
          <Text 
            style={styles.cardSubtitle}
            accessible={true}
            accessibilityRole="text"
          >
            Manage your preferences
          </Text>

          {/* Change PIN */}
          <View 
            style={styles.settingRow}
            accessible={false}
          >
            <Text 
              style={styles.settingText}
              accessible={false}
            >
              Change PIN
            </Text>
            <Pressable 
              onPress={() => setIsChangingPin(true)} 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Change PIN"
              accessibilityHint="Change your security PIN"
              style={styles.smallBtnAlt}
            >
              <Text 
                style={styles.smallBtnAltText}
                accessible={false}
              >
                Update
              </Text>
            </Pressable>
          </View>

          {/* High Contrast Mode */}
          <View 
            style={styles.settingRow}
            accessible={false}
          >
            <View 
              style={{ flex: 1 }}
              accessible={false}
            >
              <Text 
                style={styles.settingText}
                accessible={false}
              >
                High Contrast Mode
              </Text>
              <Text 
                style={styles.settingSubText}
                accessible={false}
              >
                Enhance visibility
              </Text>
            </View>
            <Pressable
              onPress={() => setHighContrastMode(!highContrastMode)}
              accessible={true}
              accessibilityRole="switch"
              accessibilityLabel="High Contrast Mode"
              accessibilityHint="Toggle high contrast mode for better visibility"
              accessibilityState={{ checked: highContrastMode }}
              style={[styles.switch, highContrastMode ? styles.switchOn : styles.switchOff]}
            >
              <View 
                style={[styles.switchKnob, highContrastMode ? styles.knobOn : styles.knobOff]}
                accessible={false}
              />
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable 
            onPress={handleLogout} 
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            accessibilityHint="Log out of your account"
            style={styles.logoutBtn}
          >
            <Text 
              style={styles.logoutText}
              accessible={false}
            >
              Logout
            </Text>
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
              <Text 
                style={styles.label}
                accessible={false}
              >
                Full Name
              </Text>
              <TextInput
                value={profileData.fullName}
                onChangeText={(t) => handleProfileChange("fullName", t)}
                accessible={true}
                accessibilityLabel="Full Name"
                accessibilityHint="Enter your full name"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text 
                style={styles.label}
                accessible={false}
              >
                Email
              </Text>
              <TextInput
                value={profileData.email}
                onChangeText={(t) => handleProfileChange("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Email"
                accessibilityHint="Enter your email address"
                style={styles.input}
              />
            </View>

            <View style={styles.modalField}>
              <Text 
                style={styles.label}
                accessible={false}
              >
                Username
              </Text>
              <TextInput
                value={profileData.username}
                onChangeText={(t) => handleProfileChange("username", t)}
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Username"
                accessibilityHint="Enter your username"
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
              <Pressable 
                onPress={handleSaveProfile} 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Save Changes"
                accessibilityHint="Save your profile changes"
                style={styles.modalPrimaryBtn}
              >
                <Text 
                  style={styles.modalPrimaryText}
                  accessible={false}
                >
                  Save Changes
                </Text>
              </Pressable>
              <Pressable 
                onPress={handleCancelEdit} 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                accessibilityHint="Cancel editing profile"
                style={styles.modalSecondaryBtn}
              >
                <Text 
                  style={styles.modalSecondaryText}
                  accessible={false}
                >
                  Cancel
                </Text>
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
              <Pressable 
                onPress={handleCancelPin} 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                accessibilityHint="Cancel changing PIN"
                style={styles.modalSecondaryBtn}
              >
                <Text 
                  style={styles.modalSecondaryText}
                  accessible={false}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable 
                onPress={handleSavePin} 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Save Changes"
                accessibilityHint="Save your new PIN"
                style={styles.modalPrimaryBtn}
              >
                <Text 
                  style={styles.modalPrimaryText}
                  accessible={false}
                >
                  Save Changes
                </Text>
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
      <Text 
        style={styles.label}
        accessible={true}
        accessibilityRole="header"
      >
        {label}
      </Text>
      <View 
        style={styles.pinRow}
        accessible={false}
      >
        {value.map((digit, index) => (
          <TextInput
            key={`${type}-${index}`}
            ref={(el) => (refsArray.current[index] = el)}
            value={digit}
            onChangeText={(t) => onChange(index, t, type)}
            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index, type)}
            keyboardType="number-pad"
            maxLength={1}
            accessible={true}
            accessibilityLabel={`${label} digit ${index + 1} of 6`}
            accessibilityHint="Enter a single digit"
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
