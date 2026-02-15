import { router } from "expo-router";
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

import { useTheme } from "@/context/ThemeContext";

type PersonalForm = {
  fullName: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  email: string;
  address: string;
};

type EmergencyForm = {
  name: string;
  phone: string;
};

const ORIGINAL_PERSONAL: PersonalForm = {
  fullName: "John Doe",
  dateOfBirth: "1958-03-15",
  email: "Jdoe@hotmail.com",
  address: "123 Oak Street, Springfield, IL 62701",
};

const ORIGINAL_EMERGENCY: EmergencyForm = {
  name: "Jane Doe (Daughter)",
  phone: "(555) 123-4567",
};

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(`${birthDate}T00:00:00`);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDateLong(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PatientInfoScreen() {
  const { highContrastMode } = useTheme();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);

  const [formData, setFormData] = useState<PersonalForm>(ORIGINAL_PERSONAL);
  const [emergencyContactData, setEmergencyContactData] =
    useState<EmergencyForm>(ORIGINAL_EMERGENCY);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      headerBg: highContrastMode ? "#000000" : "#FFFFFF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      primary: highContrastMode ? "#FFFF00" : "#155DFC",
      orange: "#EA580C",
      danger: "#DC2626",

      inputBg: highContrastMode ? "#2a2a2a" : "#FFFFFF",
      inputBorder: highContrastMode ? "#FFFF00" : "#E5E7EB",
      inputText: highContrastMode ? "#FFFFFF" : "#101828",
      placeholder: highContrastMode ? "#AAAAAA" : "#9CA3AF",

      modalBackdrop: highContrastMode ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.50)",
      modalCard: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      modalHeaderText: highContrastMode ? "#000000" : "#FFFFFF",
    }),
    [highContrastMode],
  );

  const handleSavePersonal = () => {
    // TODO: API call
    setIsEditingPersonal(false);
  };

  const handleCancelEdit = () => {
    setFormData(ORIGINAL_PERSONAL);
    setIsEditingPersonal(false);
  };

  const handleSaveEmergency = () => {
    // TODO: API call
    setIsEditingEmergency(false);
  };

  const handleCancelEmergency = () => {
    setEmergencyContactData(ORIGINAL_EMERGENCY);
    setIsEditingEmergency(false);
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.bg }}
      accessible={false}
    >
      <View 
        style={[styles.screen, { backgroundColor: colors.bg }]}
        accessible={false}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
          ]}
          accessible={false}
        >
          <View 
            style={styles.headerRow}
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
                style={{ color: highContrastMode ? colors.primary : colors.title, fontSize: 20, fontWeight: "900" }}
                accessible={false}
              >
                ←
              </Text>
            </Pressable>

            <View
              style={[
                styles.headerIcon,
                { backgroundColor: highContrastMode ? colors.primary : colors.orange },
              ]}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Patient information icon"
            >
              <Text 
                style={{ color: highContrastMode ? "#000" : "#fff", fontWeight: "900" }}
                accessible={false}
              >
                👤
              </Text>
            </View>

            <View 
              style={{ flex: 1 }}
              accessible={false}
            >
              <Text 
                style={[styles.headerTitle, { color: colors.title }]}
                accessible={true}
                accessibilityRole="header"
              >
                Patient Information
              </Text>
              <Text 
                style={[styles.headerSub, { color: colors.sub }]}
                accessible={true}
                accessibilityRole="text"
              >
                Medical details & emergency contact
              </Text>
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
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text 
              style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}
              accessible={false}
            >
              ← Back to Dashboard
            </Text>
          </Pressable>

          {/* Patient Information Card */}
          <View 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessible={false}
          >
            <View 
              style={[styles.cardHeaderRow, { borderBottomColor: colors.border }]}
              accessible={false}
            >
              <View 
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                accessible={false}
              >
                <Text 
                  style={{ fontSize: 18 }}
                  accessible={false}
                >
                  {highContrastMode ? "👤" : "👤"}
                </Text>
                <View accessible={false}>
                  <Text 
                    style={{ fontWeight: "900", color: colors.title }}
                    accessible={true}
                    accessibilityRole="header"
                  >
                    Patient Information
                  </Text>
                  <Text 
                    style={{ fontWeight: "800", color: colors.sub, marginTop: 2 }}
                    accessible={true}
                    accessibilityRole="text"
                  >
                    Personal and medical details
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setIsEditingPersonal(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Edit patient information"
                accessibilityHint="Edit your personal and medical details"
                style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.85 }]}
              >
                <Text 
                  style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}
                  accessible={false}
                >
                  ✎ Edit
                </Text>
              </Pressable>
            </View>

            {/* Personal Details */}
            <View 
              style={{ marginTop: 14, gap: 12 }}
              accessible={false}
            >
              <SectionTitle title="Personal Details" highContrast={highContrastMode} colors={colors} icon="🧾" />

              <Field label="Full Name" value={formData.fullName} colors={colors} />
              <Field
                label="Date of Birth"
                value={`${formatDateLong(formData.dateOfBirth)} (${age} years old)`}
                colors={colors}
              />
              <Field label="Email" value={formData.email} colors={colors} />
              <Field label="Address" value={formData.address} colors={colors} />
            </View>

            <View style={[styles.divider, { borderTopColor: colors.border }]} />

            {/* Medical Information (static, like your web example) */}
            <View style={{ marginTop: 14, gap: 12 }}>
              <SectionTitle title="Medical Information" highContrast={highContrastMode} colors={colors} icon="🩺" />

              <Field label="Primary Physician" value="Dr. Sarah Smith" colors={colors} subValue="Cardiology Specialist" />
              <Field label="Medical Conditions" value="Hypertension, Type 2 Diabetes" colors={colors} />
              <Field label="Current Medications" value="Lisinopril, Metformin" colors={colors} />
              <Field label="Allergies" value="Penicillin, Sulfa drugs" colors={colors} />
            </View>
          </View>

          {/* Emergency Contact Card */}
          <View 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessible={false}
          >
            <View 
              style={[styles.cardHeaderRow, { borderBottomColor: colors.border }]}
              accessible={false}
            >
              <View 
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                accessible={false}
              >
                <Text 
                  style={{ fontSize: 18 }}
                  accessible={false}
                >
                  🆘
                </Text>
                <Text 
                  style={{ fontWeight: "900", color: colors.title }}
                  accessible={true}
                  accessibilityRole="header"
                >
                  Emergency Contact
                </Text>
              </View>

              <Pressable
                onPress={() => setIsEditingEmergency(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Edit emergency contact"
                accessibilityHint="Edit your emergency contact information"
                style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.85 }]}
              >
                <Text 
                  style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}
                  accessible={false}
                >
                  ✎ Edit
                </Text>
              </Pressable>
            </View>

            <View 
              style={{ marginTop: 14, gap: 12 }}
              accessible={false}
            >
              <Field label="Contact Name" value={emergencyContactData.name} colors={colors} />
              <Field label="Phone Number" value={emergencyContactData.phone} colors={colors} />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Edit Personal Modal */}
        <Modal transparent visible={isEditingPersonal} animationType="fade" onRequestClose={handleCancelEdit}>
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.modalCard, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor: highContrastMode ? "#2a2a2a" : colors.primary,
                    borderBottomColor: highContrastMode ? colors.border : "transparent",
                    borderBottomWidth: highContrastMode ? 1 : 0,
                  },
                ]}
              >
                <Text style={[styles.modalTitle, { color: highContrastMode ? colors.primary : "#fff" }]}>
                  Edit Personal Details
                </Text>
                <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? colors.primary : "rgba(255,255,255,0.9)" }}>
                  Update your personal information
                </Text>
              </View>

              <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 16, gap: 14 }}>
                <LabeledInput
                  label="Full Name"
                  value={formData.fullName}
                  onChangeText={(t) => setFormData((p) => ({ ...p, fullName: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                />
                <LabeledInput
                  label="Date of Birth (YYYY-MM-DD)"
                  value={formData.dateOfBirth}
                  onChangeText={(t) => setFormData((p) => ({ ...p, dateOfBirth: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  keyboardType="numbers-and-punctuation"
                />
                <Text style={{ marginTop: -6, fontWeight: "800", color: colors.sub }}>
                  Age: {calculateAge(formData.dateOfBirth)} years
                </Text>
                <LabeledInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(t) => setFormData((p) => ({ ...p, email: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <LabeledInput
                  label="Address"
                  value={formData.address}
                  onChangeText={(t) => setFormData((p) => ({ ...p, address: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  multiline
                />
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <Pressable
                  onPress={handleCancelEdit}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityHint="Cancel editing personal details"
                  style={({ pressed }) => [
                    styles.footerBtn,
                    { borderColor: colors.border, backgroundColor: highContrastMode ? "transparent" : "#fff" },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text 
                    style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}
                    accessible={false}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSavePersonal}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Save Changes"
                  accessibilityHint="Save your personal details"
                  style={({ pressed }) => [
                    styles.footerBtnPrimary,
                    { backgroundColor: highContrastMode ? colors.primary : colors.primary },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text 
                    style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}
                    accessible={false}
                  >
                    Save Changes
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Emergency Modal */}
        <Modal
          transparent
          visible={isEditingEmergency}
          animationType="fade"
          onRequestClose={handleCancelEmergency}
        >
          <View style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.modalCard, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor: highContrastMode ? "#2a2a2a" : colors.danger,
                    borderBottomColor: highContrastMode ? colors.border : "transparent",
                    borderBottomWidth: highContrastMode ? 1 : 0,
                  },
                ]}
              >
                <Text style={[styles.modalTitle, { color: highContrastMode ? colors.primary : "#fff" }]}>
                  Edit Emergency Contact
                </Text>
                <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? colors.primary : "rgba(255,255,255,0.9)" }}>
                  Update your emergency contact information
                </Text>
              </View>

              <View style={{ padding: 16, gap: 14 }}>
                <LabeledInput
                  label="Contact Name"
                  value={emergencyContactData.name}
                  onChangeText={(t) => setEmergencyContactData((p) => ({ ...p, name: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                />
                <LabeledInput
                  label="Phone Number"
                  value={emergencyContactData.phone}
                  onChangeText={(t) => setEmergencyContactData((p) => ({ ...p, phone: t }))}
                  colors={colors}
                  highContrastMode={highContrastMode}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <Pressable
                  onPress={handleCancelEmergency}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityHint="Cancel editing emergency contact"
                  style={({ pressed }) => [
                    styles.footerBtn,
                    { borderColor: colors.border, backgroundColor: highContrastMode ? "transparent" : "#fff" },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text 
                    style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}
                    accessible={false}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSaveEmergency}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Save Changes"
                  accessibilityHint="Save emergency contact"
                  style={({ pressed }) => [
                    styles.footerBtnPrimary,
                    { backgroundColor: highContrastMode ? colors.primary : colors.danger },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text 
                    style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}
                    accessible={false}
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

function SectionTitle({
  title,
  icon,
  colors,
}: {
  title: string;
  icon: string;
  highContrast: boolean;
  colors: any;
}) {
  return (
    <View 
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      accessible={false}
    >
      <Text 
        style={{ fontSize: 16 }}
        accessible={false}
      >
        {icon}
      </Text>
      <Text 
        style={{ fontSize: 16, fontWeight: "900", color: colors.title }}
        accessible={true}
        accessibilityRole="header"
      >
        {title}
      </Text>
    </View>
  );
}

function Field({
  label,
  value,
  subValue,
  colors,
}: {
  label: string;
  value: string;
  subValue?: string;
  colors: any;
}) {
  return (
    <View 
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}${subValue ? '. ' + subValue : ''}`}
    >
      <Text 
        style={{ fontSize: 13, fontWeight: "900", color: colors.sub, marginBottom: 4 }}
        accessible={false}
      >
        {label}
      </Text>
      <Text 
        style={{ fontSize: 15, fontWeight: "800", color: colors.title }}
        accessible={false}
      >
        {value}
      </Text>
      {subValue ? (
        <Text 
          style={{ marginTop: 2, fontSize: 13, fontWeight: "800", color: colors.sub }}
          accessible={false}
        >
          {subValue}
        </Text>
      ) : null}
    </View>
  );
}

function LabeledInput(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  colors: any;
  highContrastMode: boolean;
  multiline?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  const {
    label,
    value,
    onChangeText,
    colors,
    highContrastMode,
    multiline,
    keyboardType,
    autoCapitalize,
  } = props;

  return (
    <View>
      <Text 
        style={{ fontSize: 13, fontWeight: "900", color: highContrastMode ? "#fff" : "#101828", marginBottom: 6 }}
        accessible={false}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={`Enter ${label.toLowerCase()}`}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
            height: multiline ? 96 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  editBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },

  divider: { marginTop: 16, borderTopWidth: 1 },

  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 520, borderRadius: 22, overflow: "hidden" },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14 },
  modalTitle: { fontSize: 18, fontWeight: "900" },

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

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontWeight: "800",
  },
});
