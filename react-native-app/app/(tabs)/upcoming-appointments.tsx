<<<<<<< HEAD
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Appointment,
  useScheduledAppointments,
} from "../../context/ScheduledAppointmentsContext"; // adjust if needed
import { useTheme } from "../../context/ThemeContext"; // adjust if needed

export default function UpcomingAppointments() {
  const router = useRouter();
  const { highContrastMode } = useTheme();
  const { confirmAppointment, isAppointmentConfirmed, allAppointments } =
    useScheduledAppointments();

  const styles = useMemo(() => makeStyles(highContrastMode), [highContrastMode]);

  const [view, setView] = useState<"schedule" | "calendar">("schedule");
  const [showAll, setShowAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0); // Jan 2026 = 0
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // hold-to-confirm
  const HOLD_DURATION = 5000;
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmProgress, setConfirmProgress] = useState(0);

  const holdStartTimeRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getMonthYear = (monthIndex: number) => {
    const baseDate = new Date(2026, 0, 1);
    baseDate.setMonth(baseDate.getMonth() + monthIndex);
    return baseDate;
  };

  const isWithinNextWeek = (dateString: string) => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const dateMatch = dateString.match(/^([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})$/);
    if (!dateMatch) return false;

    const monthStr = dateMatch[1];
    const day = parseInt(dateMatch[2], 10);
    const year = parseInt(dateMatch[3], 10);

    const monthIndex = monthNames.indexOf(monthStr);
    if (monthIndex === -1) return false;

    const appointmentDate = new Date(year, monthIndex, day);
    const todayDate = new Date(2026, 0, 25); // Jan 25, 2026
    const oneWeekLater = new Date(todayDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    return appointmentDate >= todayDate && appointmentDate < oneWeekLater;
  };

  const appointmentsWithinWeek = allAppointments.filter((apt) =>
    isWithinNextWeek(apt.date)
  );
  const displayedAppointments = showAll
    ? appointmentsWithinWeek
    : appointmentsWithinWeek.slice(0, 5);

  const getAppointmentsForDate = (day: number, monthIndex: number) => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const year = 2026 + Math.floor(monthIndex / 12);
    const monthNum = monthIndex % 12;
    const monthStr = monthNames[monthNum];
    const dateStr = `${monthStr} ${day}, ${year}`;
    return allAppointments.filter((apt) => apt.date === dateStr);
  };

  const hasAppointments = (day: number, monthIndex: number) =>
    getAppointmentsForDate(day, monthIndex).length > 0;

  const generateCalendarDays = (monthIndex: number) => {
    const date = getMonthYear(monthIndex);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const allMonths = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const displayDate = getMonthYear(currentMonth);
  const monthDisplay = `${allMonths[displayDate.getMonth()]} ${displayDate.getFullYear()}`;

  const today = 25; // Jan 25, 2026

  const cleanupHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    holdTimeoutRef.current = null;
    intervalRef.current = null;
    holdStartTimeRef.current = null;
    setIsConfirming(false);
    setConfirmProgress(0);
  };

  const startHoldConfirm = () => {
    if (!selectedAppointment) return;
    if (isAppointmentConfirmed(selectedAppointment.id)) return;
    if (isConfirming) return;

    setIsConfirming(true);
    setConfirmProgress(0);
    holdStartTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (!holdStartTimeRef.current) return;
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setConfirmProgress(progress);
    }, 50);

    holdTimeoutRef.current = setTimeout(() => {
      setConfirmProgress(100);
      confirmAppointment(selectedAppointment.id);

      // close after a short beat
      setTimeout(() => setSelectedAppointment(null), 450);
      cleanupHold();
    }, HOLD_DURATION);
  };

  const cancelHoldConfirm = () => {
    if (!isConfirming) return;
    cleanupHold();
  };

  useEffect(() => {
    return () => cleanupHold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push("/tasks")} style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Upcoming Appointments</Text>
              <Text style={styles.headerSub}>Your scheduled visits</Text>
            </View>
          </View>

          <View style={{ width: 32 }} />
        </View>

        <Pressable onPress={() => router.push("/tasks")} style={styles.backToTasksBtn}>
          <Text style={styles.backToTasksText}>← Back to Tasks & Scheduling</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <Text style={styles.sectionSub}>Your scheduled visits</Text>
          </View>

          {appointmentsWithinWeek.length > 5 && (
            <Pressable onPress={() => setShowAll(!showAll)} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>{showAll ? "Show Less" : "View All"}</Text>
            </Pressable>
          )}
        </View>

        {/* View toggle */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={() => setView("schedule")}
            style={[styles.toggleBtn, view === "schedule" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === "schedule" && styles.toggleTextActive]}>
              Schedule
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setView("calendar")}
            style={[styles.toggleBtn, view === "calendar" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === "calendar" && styles.toggleTextActive]}>
              Calendar
            </Text>
          </Pressable>
        </View>

        {/* Schedule view */}
        {view === "schedule" && (
          <View style={{ gap: 10 }}>
            {displayedAppointments.map((appointment) => {
              const confirmed = isAppointmentConfirmed(appointment.id);

              return (
                <Pressable
                  key={appointment.id}
                  onPress={() => setSelectedAppointment(appointment)}
                  style={[
                    styles.apptCard,
                    confirmed && styles.apptCardConfirmed,
                  ]}
                >
                  <View style={styles.apptRow}>
                    <View style={[styles.apptBadge, confirmed ? styles.badgeConfirmed : styles.badgeDefault]}>
                      <Text style={styles.badgeText}>⟲</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.apptTitle, confirmed && styles.apptTitleConfirmed]}>
                        {appointment.title}
                      </Text>
                      <Text style={[styles.apptMeta, confirmed && styles.apptMetaConfirmed]}>
                        {appointment.date} at {appointment.time}
                      </Text>
                    </View>

                    {confirmed && (
                      <View style={styles.check}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Calendar view */}
        {view === "calendar" && (
          <View style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <Pressable
                onPress={() => {
                  if (currentMonth > 0) {
                    setCurrentMonth(currentMonth - 1);
                    setSelectedDate(null);
                  }
                }}
                disabled={currentMonth === 0}
                style={[styles.monthNavBtn, currentMonth === 0 && styles.monthNavDisabled]}
              >
                <Text style={styles.monthNavText}>←</Text>
              </Pressable>

              <Text style={styles.monthTitle}>{monthDisplay}</Text>

              <Pressable
                onPress={() => {
                  if (currentMonth < 12) {
                    setCurrentMonth(currentMonth + 1);
                    setSelectedDate(null);
                  }
                }}
                disabled={currentMonth === 12}
                style={[styles.monthNavBtn, currentMonth === 12 && styles.monthNavDisabled]}
              >
                <Text style={styles.monthNavText}>→</Text>
              </Pressable>
            </View>

            <View style={styles.dowRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <Text key={d} style={styles.dowText}>{d}</Text>
              ))}
            </View>

            <View style={styles.grid}>
              {calendarDays.map((day, idx) => {
                if (day === null) return <View key={`empty-${idx}`} style={styles.dayEmpty} />;

                const isToday = day === today && currentMonth === 0;
                const hasAppts = hasAppointments(day, currentMonth);
                const isSelected = selectedDate === day;

                return (
                  <Pressable
                    key={`${currentMonth}-${day}`}
                    onPress={() => {
                      if (!hasAppts) return;
                      setSelectedDate(isSelected ? null : day);
                    }}
                    style={[
                      styles.dayCell,
                      isToday && styles.dayToday,
                      isSelected && styles.daySelected,
                      hasAppts && styles.dayHasAppts,
                    ]}
                  >
                    <Text style={[styles.dayText, (isToday || isSelected) && styles.dayTextActive]}>
                      {day}
                    </Text>
                    {hasAppts && <View style={styles.dot} />}
                  </Pressable>
                );
              })}
            </View>

            {selectedDate && (
              <View style={styles.selectedBlock}>
                <Text style={styles.selectedTitle}>
                  Appointments on {displayDate.toLocaleDateString("en-US", { month: "short" })}{" "}
                  {selectedDate}
                </Text>

                <View style={{ gap: 10 }}>
                  {getAppointmentsForDate(selectedDate, currentMonth).map((apt) => (
                    <Pressable
                      key={apt.id}
                      onPress={() => setSelectedAppointment(apt)}
                      style={styles.selectedApptCard}
                    >
                      <Text style={styles.selectedApptTitle}>{apt.title}</Text>
                      <Text style={styles.selectedApptTime}>{apt.time}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Details modal */}
      <Modal
        visible={!!selectedAppointment}
        transparent
        animationType="fade"
        onRequestClose={() => {
          cancelHoldConfirm();
          setSelectedAppointment(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                <Text style={styles.modalSub}>View information about your appointment</Text>
              </View>
              <Pressable
                onPress={() => {
                  cancelHoldConfirm();
                  setSelectedAppointment(null);
                }}
                style={styles.iconBtn}
              >
                <Text style={styles.iconText}>✕</Text>
              </Pressable>
            </View>

            {selectedAppointment && (
              <>
                <View style={styles.modalTopCard}>
                  <Text style={styles.modalApptTitle}>{selectedAppointment.title}</Text>
                  <Text style={styles.modalApptSub}>{selectedAppointment.subtitle}</Text>
                </View>

                <View style={{ gap: 10 }}>
                  <InfoRow
                    styles={styles}
                    label="Date & Time"
                    value={`${selectedAppointment.date} at ${selectedAppointment.time}`}
                  />
                  {selectedAppointment.provider && (
                    <InfoRow styles={styles} label="Provider" value={selectedAppointment.provider} />
                  )}
                  {selectedAppointment.location && (
                    <InfoRow styles={styles} label="Location" value={selectedAppointment.location} />
                  )}
                  {selectedAppointment.notes && (
                    <InfoRow styles={styles} label="Important Notes" value={selectedAppointment.notes} />
                  )}
                </View>

                <View style={styles.modalBtnRow}>
                  <Pressable
                    onPress={() => {
                      cancelHoldConfirm();
                      setSelectedAppointment(null);
                    }}
                    style={styles.modalSecondaryBtn}
                  >
                    <Text style={styles.modalSecondaryText}>Close</Text>
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPressIn={startHoldConfirm}
                      onPressOut={cancelHoldConfirm}
                      disabled={isAppointmentConfirmed(selectedAppointment.id)}
                      style={[
                        styles.modalPrimaryBtn,
                        isAppointmentConfirmed(selectedAppointment.id) && styles.modalPrimaryDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalPrimaryText,
                          isAppointmentConfirmed(selectedAppointment.id) && styles.modalPrimaryTextDisabled,
                        ]}
                      >
                        {isAppointmentConfirmed(selectedAppointment.id)
                          ? "Confirmed ✓"
                          : confirmProgress >= 100
                          ? "Confirmed!"
                          : `Hold to Confirm (${Math.round(confirmProgress)}%)`}
                      </Text>

                      {isConfirming && (
                        <View style={[styles.progressFill, { width: `${confirmProgress}%` }]} />
                      )}
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({
  styles,
  label,
  value,
}: {
  styles: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (hc: boolean) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: hc ? "#000" : "#F4F7FF" },

    header: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
      gap: 10,
    },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    iconBtn: { padding: 8 },
    iconText: { fontSize: 18, fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
      alignItems: "center",
      justifyContent: "center",
    },
    headerIconText: { fontSize: 18, color: hc ? "#000" : "#fff" },
    headerTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    headerSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    backToTasksBtn: {
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },
    backToTasksText: { fontWeight: "800", color: hc ? "#FFFF00" : "#101828" },

    content: { padding: 16, paddingBottom: 24, gap: 14 },

    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionTitle: { fontSize: 16, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    sectionSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    viewAllBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
    },
    viewAllText: { fontWeight: "800", color: hc ? "#FFFF00" : "#101828" },

    toggleRow: { flexDirection: "row", gap: 10 },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      alignItems: "center",
    },
    toggleBtnActive: { borderColor: hc ? "#FFFF00" : "#101828" },
    toggleText: { fontWeight: "800", color: hc ? "#fff" : "#6B7280" },
    toggleTextActive: { color: hc ? "#FFFF00" : "#101828" },

    apptCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 14,
    },
    apptCardConfirmed: {
      backgroundColor: hc ? "#FFFF00" : "#D1FAE5",
      borderColor: hc ? "#FFFF00" : "#6EE7B7",
    },
    apptRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    apptBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeDefault: { backgroundColor: hc ? "#FFFF00" : "#E0F2FE" },
    badgeConfirmed: { backgroundColor: hc ? "rgba(0,0,0,0.2)" : "rgba(16,185,129,0.2)" },
    badgeText: { fontSize: 18, fontWeight: "900", color: "#000" },

    apptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    apptTitleConfirmed: { color: "#101828", textDecorationLine: hc ? "none" : "line-through" },
    apptMeta: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },
    apptMetaConfirmed: { color: "#101828" },

    check: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: hc ? "#000" : "#10B981",
      alignItems: "center",
      justifyContent: "center",
    },
    checkText: { color: hc ? "#FFFF00" : "#fff", fontWeight: "900" },

    calendarCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 14,
      gap: 12,
    },
    monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    monthNavBtn: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
    },
    monthNavDisabled: { opacity: 0.4 },
    monthNavText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },
    monthTitle: { fontWeight: "900", fontSize: 16, color: hc ? "#fff" : "#101828" },

    dowRow: { flexDirection: "row", justifyContent: "space-between" },
    dowText: { width: "14.285%", textAlign: "center", fontWeight: "800", color: hc ? "#FFFF00" : "#6B7280" },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    dayEmpty: { width: "13.1%", aspectRatio: 1 },
    dayCell: {
      width: "13.1%",
      aspectRatio: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hc ? "#111" : "#fff",
    },
    dayToday: { backgroundColor: hc ? "#FFFF00" : "#155DFC", borderColor: hc ? "#FFFF00" : "#155DFC" },
    daySelected: { borderColor: hc ? "#FFFF00" : "#155DFC", backgroundColor: hc ? "#2a2a2a" : "#EFF6FF" },
    dayHasAppts: { },
    dayText: { fontWeight: "800", color: hc ? "#fff" : "#101828" },
    dayTextActive: { color: hc ? "#000" : "#fff" },
    dot: {
      position: "absolute",
      bottom: 6,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: hc ? "#FFFF00" : "#00BBA7",
    },

    selectedBlock: { marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: hc ? "#FFFF00" : "#E5E7EB", gap: 10 },
    selectedTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    selectedApptCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
      padding: 12,
    },
    selectedApptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    selectedApptTime: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    modalOverlay: {
      flex: 1,
      backgroundColor: hc ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 16,
    },
    modalCard: {
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      gap: 12,
    },
    modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    modalTopCard: {
      borderRadius: 14,
      padding: 12,
      borderWidth: hc ? 1 : 0,
      borderColor: hc ? "#FFFF00" : "transparent",
      backgroundColor: hc ? "#2a2a2a" : "#EFF6FF",
    },
    modalApptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalApptSub: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    infoRow: { gap: 4 },
    infoLabel: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    infoValue: { color: hc ? "#FFFF00" : "#6B7280" },

    modalBtnRow: { flexDirection: "row", gap: 10, marginTop: 6, alignItems: "center" },
    modalSecondaryBtn: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#fff",
    },
    modalSecondaryText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    modalPrimaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
    },
    modalPrimaryDisabled: { opacity: 0.6 },
    modalPrimaryText: { fontWeight: "900", color: hc ? "#000" : "#fff" },
    modalPrimaryTextDisabled: { color: hc ? "#111" : "#fff" },

    progressFill: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: hc ? "rgba(255,255,0,0.3)" : "rgba(21,93,252,0.3)",
    },
  });
=======
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Appointment,
  useScheduledAppointments,
} from "../../context/ScheduledAppointmentsContext"; // adjust if needed
import { useTheme } from "../../context/ThemeContext"; // adjust if needed

export default function UpcomingAppointments() {
  const router = useRouter();
  const { highContrastMode } = useTheme();
  const { confirmAppointment, isAppointmentConfirmed, allAppointments } =
    useScheduledAppointments();

  const styles = useMemo(() => makeStyles(highContrastMode), [highContrastMode]);

  const [view, setView] = useState<"schedule" | "calendar">("schedule");
  const [showAll, setShowAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0); // Jan 2026 = 0
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // hold-to-confirm
  const HOLD_DURATION = 5000;
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmProgress, setConfirmProgress] = useState(0);

  const holdStartTimeRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getMonthYear = (monthIndex: number) => {
    const baseDate = new Date(2026, 0, 1);
    baseDate.setMonth(baseDate.getMonth() + monthIndex);
    return baseDate;
  };

  const isWithinNextWeek = (dateString: string) => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const dateMatch = dateString.match(/^([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})$/);
    if (!dateMatch) return false;

    const monthStr = dateMatch[1];
    const day = parseInt(dateMatch[2], 10);
    const year = parseInt(dateMatch[3], 10);

    const monthIndex = monthNames.indexOf(monthStr);
    if (monthIndex === -1) return false;

    const appointmentDate = new Date(year, monthIndex, day);
    const todayDate = new Date(2026, 0, 25); // Jan 25, 2026
    const oneWeekLater = new Date(todayDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    return appointmentDate >= todayDate && appointmentDate < oneWeekLater;
  };

  const appointmentsWithinWeek = allAppointments.filter((apt) =>
    isWithinNextWeek(apt.date)
  );
  const displayedAppointments = showAll
    ? appointmentsWithinWeek
    : appointmentsWithinWeek.slice(0, 5);

  const getAppointmentsForDate = (day: number, monthIndex: number) => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const year = 2026 + Math.floor(monthIndex / 12);
    const monthNum = monthIndex % 12;
    const monthStr = monthNames[monthNum];
    const dateStr = `${monthStr} ${day}, ${year}`;
    return allAppointments.filter((apt) => apt.date === dateStr);
  };

  const hasAppointments = (day: number, monthIndex: number) =>
    getAppointmentsForDate(day, monthIndex).length > 0;

  const generateCalendarDays = (monthIndex: number) => {
    const date = getMonthYear(monthIndex);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const allMonths = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const displayDate = getMonthYear(currentMonth);
  const monthDisplay = `${allMonths[displayDate.getMonth()]} ${displayDate.getFullYear()}`;

  const today = 25; // Jan 25, 2026

  const cleanupHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    holdTimeoutRef.current = null;
    intervalRef.current = null;
    holdStartTimeRef.current = null;
    setIsConfirming(false);
    setConfirmProgress(0);
  };

  const startHoldConfirm = () => {
    if (!selectedAppointment) return;
    if (isAppointmentConfirmed(selectedAppointment.id)) return;
    if (isConfirming) return;

    setIsConfirming(true);
    setConfirmProgress(0);
    holdStartTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (!holdStartTimeRef.current) return;
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setConfirmProgress(progress);
    }, 50);

    holdTimeoutRef.current = setTimeout(() => {
      setConfirmProgress(100);
      confirmAppointment(selectedAppointment.id);

      // close after a short beat
      setTimeout(() => setSelectedAppointment(null), 450);
      cleanupHold();
    }, HOLD_DURATION);
  };

  const cancelHoldConfirm = () => {
    if (!isConfirming) return;
    cleanupHold();
  };

  useEffect(() => {
    return () => cleanupHold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push("/tasks")} style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Upcoming Appointments</Text>
              <Text style={styles.headerSub}>Your scheduled visits</Text>
            </View>
          </View>

          <View style={{ width: 32 }} />
        </View>

        <Pressable onPress={() => router.push("/tasks")} style={styles.backToTasksBtn}>
          <Text style={styles.backToTasksText}>← Back to Tasks & Scheduling</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <Text style={styles.sectionSub}>Your scheduled visits</Text>
          </View>

          {appointmentsWithinWeek.length > 5 && (
            <Pressable onPress={() => setShowAll(!showAll)} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>{showAll ? "Show Less" : "View All"}</Text>
            </Pressable>
          )}
        </View>

        {/* View toggle */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={() => setView("schedule")}
            style={[styles.toggleBtn, view === "schedule" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === "schedule" && styles.toggleTextActive]}>
              Schedule
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setView("calendar")}
            style={[styles.toggleBtn, view === "calendar" && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, view === "calendar" && styles.toggleTextActive]}>
              Calendar
            </Text>
          </Pressable>
        </View>

        {/* Schedule view */}
        {view === "schedule" && (
          <View style={{ gap: 10 }}>
            {displayedAppointments.map((appointment) => {
              const confirmed = isAppointmentConfirmed(appointment.id);

              return (
                <Pressable
                  key={appointment.id}
                  onPress={() => setSelectedAppointment(appointment)}
                  style={[
                    styles.apptCard,
                    confirmed && styles.apptCardConfirmed,
                  ]}
                >
                  <View style={styles.apptRow}>
                    <View style={[styles.apptBadge, confirmed ? styles.badgeConfirmed : styles.badgeDefault]}>
                      <Text style={styles.badgeText}>⟲</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.apptTitle, confirmed && styles.apptTitleConfirmed]}>
                        {appointment.title}
                      </Text>
                      <Text style={[styles.apptMeta, confirmed && styles.apptMetaConfirmed]}>
                        {appointment.date} at {appointment.time}
                      </Text>
                    </View>

                    {confirmed && (
                      <View style={styles.check}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Calendar view */}
        {view === "calendar" && (
          <View style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <Pressable
                onPress={() => {
                  if (currentMonth > 0) {
                    setCurrentMonth(currentMonth - 1);
                    setSelectedDate(null);
                  }
                }}
                disabled={currentMonth === 0}
                style={[styles.monthNavBtn, currentMonth === 0 && styles.monthNavDisabled]}
              >
                <Text style={styles.monthNavText}>←</Text>
              </Pressable>

              <Text style={styles.monthTitle}>{monthDisplay}</Text>

              <Pressable
                onPress={() => {
                  if (currentMonth < 12) {
                    setCurrentMonth(currentMonth + 1);
                    setSelectedDate(null);
                  }
                }}
                disabled={currentMonth === 12}
                style={[styles.monthNavBtn, currentMonth === 12 && styles.monthNavDisabled]}
              >
                <Text style={styles.monthNavText}>→</Text>
              </Pressable>
            </View>

            <View style={styles.dowRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <Text key={d} style={styles.dowText}>{d}</Text>
              ))}
            </View>

            <View style={styles.grid}>
              {calendarDays.map((day, idx) => {
                if (day === null) return <View key={`empty-${idx}`} style={styles.dayEmpty} />;

                const isToday = day === today && currentMonth === 0;
                const hasAppts = hasAppointments(day, currentMonth);
                const isSelected = selectedDate === day;

                return (
                  <Pressable
                    key={`${currentMonth}-${day}`}
                    onPress={() => {
                      if (!hasAppts) return;
                      setSelectedDate(isSelected ? null : day);
                    }}
                    style={[
                      styles.dayCell,
                      isToday && styles.dayToday,
                      isSelected && styles.daySelected,
                      hasAppts && styles.dayHasAppts,
                    ]}
                  >
                    <Text style={[styles.dayText, (isToday || isSelected) && styles.dayTextActive]}>
                      {day}
                    </Text>
                    {hasAppts && <View style={styles.dot} />}
                  </Pressable>
                );
              })}
            </View>

            {selectedDate && (
              <View style={styles.selectedBlock}>
                <Text style={styles.selectedTitle}>
                  Appointments on {displayDate.toLocaleDateString("en-US", { month: "short" })}{" "}
                  {selectedDate}
                </Text>

                <View style={{ gap: 10 }}>
                  {getAppointmentsForDate(selectedDate, currentMonth).map((apt) => (
                    <Pressable
                      key={apt.id}
                      onPress={() => setSelectedAppointment(apt)}
                      style={styles.selectedApptCard}
                    >
                      <Text style={styles.selectedApptTitle}>{apt.title}</Text>
                      <Text style={styles.selectedApptTime}>{apt.time}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Details modal */}
      <Modal
        visible={!!selectedAppointment}
        transparent
        animationType="fade"
        onRequestClose={() => {
          cancelHoldConfirm();
          setSelectedAppointment(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                <Text style={styles.modalSub}>View information about your appointment</Text>
              </View>
              <Pressable
                onPress={() => {
                  cancelHoldConfirm();
                  setSelectedAppointment(null);
                }}
                style={styles.iconBtn}
              >
                <Text style={styles.iconText}>✕</Text>
              </Pressable>
            </View>

            {selectedAppointment && (
              <>
                <View style={styles.modalTopCard}>
                  <Text style={styles.modalApptTitle}>{selectedAppointment.title}</Text>
                  <Text style={styles.modalApptSub}>{selectedAppointment.subtitle}</Text>
                </View>

                <View style={{ gap: 10 }}>
                  <InfoRow
                    styles={styles}
                    label="Date & Time"
                    value={`${selectedAppointment.date} at ${selectedAppointment.time}`}
                  />
                  {selectedAppointment.provider && (
                    <InfoRow styles={styles} label="Provider" value={selectedAppointment.provider} />
                  )}
                  {selectedAppointment.location && (
                    <InfoRow styles={styles} label="Location" value={selectedAppointment.location} />
                  )}
                  {selectedAppointment.notes && (
                    <InfoRow styles={styles} label="Important Notes" value={selectedAppointment.notes} />
                  )}
                </View>

                <View style={styles.modalBtnRow}>
                  <Pressable
                    onPress={() => {
                      cancelHoldConfirm();
                      setSelectedAppointment(null);
                    }}
                    style={styles.modalSecondaryBtn}
                  >
                    <Text style={styles.modalSecondaryText}>Close</Text>
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPressIn={startHoldConfirm}
                      onPressOut={cancelHoldConfirm}
                      disabled={isAppointmentConfirmed(selectedAppointment.id)}
                      style={[
                        styles.modalPrimaryBtn,
                        isAppointmentConfirmed(selectedAppointment.id) && styles.modalPrimaryDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalPrimaryText,
                          isAppointmentConfirmed(selectedAppointment.id) && styles.modalPrimaryTextDisabled,
                        ]}
                      >
                        {isAppointmentConfirmed(selectedAppointment.id)
                          ? "Confirmed ✓"
                          : confirmProgress >= 100
                          ? "Confirmed!"
                          : `Hold to Confirm (${Math.round(confirmProgress)}%)`}
                      </Text>

                      {isConfirming && (
                        <View style={[styles.progressFill, { width: `${confirmProgress}%` }]} />
                      )}
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({
  styles,
  label,
  value,
}: {
  styles: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (hc: boolean) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: hc ? "#000" : "#F4F7FF" },

    header: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#000" : "#fff",
      gap: 10,
    },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    iconBtn: { padding: 8 },
    iconText: { fontSize: 18, fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
      alignItems: "center",
      justifyContent: "center",
    },
    headerIconText: { fontSize: 18, color: hc ? "#000" : "#fff" },
    headerTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    headerSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    backToTasksBtn: {
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },
    backToTasksText: { fontWeight: "800", color: hc ? "#FFFF00" : "#101828" },

    content: { padding: 16, paddingBottom: 24, gap: 14 },

    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionTitle: { fontSize: 16, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    sectionSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    viewAllBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
    },
    viewAllText: { fontWeight: "800", color: hc ? "#FFFF00" : "#101828" },

    toggleRow: { flexDirection: "row", gap: 10 },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      alignItems: "center",
    },
    toggleBtnActive: { borderColor: hc ? "#FFFF00" : "#101828" },
    toggleText: { fontWeight: "800", color: hc ? "#fff" : "#6B7280" },
    toggleTextActive: { color: hc ? "#FFFF00" : "#101828" },

    apptCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 14,
    },
    apptCardConfirmed: {
      backgroundColor: hc ? "#FFFF00" : "#D1FAE5",
      borderColor: hc ? "#FFFF00" : "#6EE7B7",
    },
    apptRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    apptBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeDefault: { backgroundColor: hc ? "#FFFF00" : "#E0F2FE" },
    badgeConfirmed: { backgroundColor: hc ? "rgba(0,0,0,0.2)" : "rgba(16,185,129,0.2)" },
    badgeText: { fontSize: 18, fontWeight: "900", color: "#000" },

    apptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    apptTitleConfirmed: { color: "#101828", textDecorationLine: hc ? "none" : "line-through" },
    apptMeta: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },
    apptMetaConfirmed: { color: "#101828" },

    check: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: hc ? "#000" : "#10B981",
      alignItems: "center",
      justifyContent: "center",
    },
    checkText: { color: hc ? "#FFFF00" : "#fff", fontWeight: "900" },

    calendarCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      padding: 14,
      gap: 12,
    },
    monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    monthNavBtn: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
    },
    monthNavDisabled: { opacity: 0.4 },
    monthNavText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },
    monthTitle: { fontWeight: "900", fontSize: 16, color: hc ? "#fff" : "#101828" },

    dowRow: { flexDirection: "row", justifyContent: "space-between" },
    dowText: { width: "14.285%", textAlign: "center", fontWeight: "800", color: hc ? "#FFFF00" : "#6B7280" },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    dayEmpty: { width: "13.1%", aspectRatio: 1 },
    dayCell: {
      width: "13.1%",
      aspectRatio: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hc ? "#111" : "#fff",
    },
    dayToday: { backgroundColor: hc ? "#FFFF00" : "#155DFC", borderColor: hc ? "#FFFF00" : "#155DFC" },
    daySelected: { borderColor: hc ? "#FFFF00" : "#155DFC", backgroundColor: hc ? "#2a2a2a" : "#EFF6FF" },
    dayHasAppts: { },
    dayText: { fontWeight: "800", color: hc ? "#fff" : "#101828" },
    dayTextActive: { color: hc ? "#000" : "#fff" },
    dot: {
      position: "absolute",
      bottom: 6,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: hc ? "#FFFF00" : "#00BBA7",
    },

    selectedBlock: { marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: hc ? "#FFFF00" : "#E5E7EB", gap: 10 },
    selectedTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    selectedApptCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#3a3a3a" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#F9FAFB",
      padding: 12,
    },
    selectedApptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    selectedApptTime: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    modalOverlay: {
      flex: 1,
      backgroundColor: hc ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 16,
    },
    modalCard: {
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#1a1a1a" : "#fff",
      gap: 12,
    },
    modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalSub: { marginTop: 2, fontSize: 12, color: hc ? "#FFFF00" : "#6B7280" },

    modalTopCard: {
      borderRadius: 14,
      padding: 12,
      borderWidth: hc ? 1 : 0,
      borderColor: hc ? "#FFFF00" : "transparent",
      backgroundColor: hc ? "#2a2a2a" : "#EFF6FF",
    },
    modalApptTitle: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    modalApptSub: { marginTop: 2, color: hc ? "#FFFF00" : "#6B7280" },

    infoRow: { gap: 4 },
    infoLabel: { fontWeight: "900", color: hc ? "#fff" : "#101828" },
    infoValue: { color: hc ? "#FFFF00" : "#6B7280" },

    modalBtnRow: { flexDirection: "row", gap: 10, marginTop: 6, alignItems: "center" },
    modalSecondaryBtn: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: hc ? "#FFFF00" : "#E5E7EB",
      backgroundColor: hc ? "#2a2a2a" : "#fff",
    },
    modalSecondaryText: { fontWeight: "900", color: hc ? "#FFFF00" : "#101828" },

    modalPrimaryBtn: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: hc ? "#FFFF00" : "#155DFC",
    },
    modalPrimaryDisabled: { opacity: 0.6 },
    modalPrimaryText: { fontWeight: "900", color: hc ? "#000" : "#fff" },
    modalPrimaryTextDisabled: { color: hc ? "#111" : "#fff" },

    progressFill: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: hc ? "rgba(255,255,0,0.3)" : "rgba(21,93,252,0.3)",
    },
  });
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
