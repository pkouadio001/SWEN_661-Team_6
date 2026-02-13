<<<<<<< HEAD
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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

import { useMessages, type Message } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

export default function MessagesScreen() {
  const { highContrastMode } = useTheme();
  const { messages, setMessages, markAsRead } = useMessages();

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      headerBg: highContrastMode ? "#000000" : "#FFFFFF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      card2: highContrastMode ? "#2a2a2a" : "#EFF6FF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      borderSoft: highContrastMode ? "#FFFF00" : "#E0E7FF",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      muted: highContrastMode ? "#FFFFFF" : "#6B7280",
      primary: highContrastMode ? "#FFFF00" : "#155DFC",
      purple: "#9333EA",
      danger: "#DC2626",
      dangerDark: "#B91C1C",
      inputBg: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      divider: highContrastMode ? "#FFFF00" : "#E5E7EB",
      historyLeftBg: highContrastMode ? "#1a1a1a" : "#EFF6FF",
      historyRightBg: highContrastMode ? "#2a2a2a" : "#DBEAFE",
      historyLeftBorder: highContrastMode ? "#FFFF00" : "#E0E7FF",
      historyRightBorder: highContrastMode ? "#FFFF00" : "#BFDBFE",
    }),
    [highContrastMode],
  );

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId);
    setReplyText("");
  };

  const handleSendReply = (messageId: number) => {
    if (!replyText.trim()) return;

    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedConversation = msg.conversation ? [...msg.conversation] : [];
          updatedConversation.push({
            id: updatedConversation.length + 1,
            sender: "You",
            message: replyText,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            isReply: true,
          });

          return {
            ...msg,
            userReply: replyText,
            conversation: updatedConversation,
            isRead: true,
          };
        }
        return msg;
      }),
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  const handleViewHistory = (message: Message) => {
    setSelectedMessage(message);
    setShowHistory(true);
    markAsRead(message.id);
  };

  const closeHistory = () => {
    setShowHistory(false);
    setSelectedMessage(null);
  };

  const handleDeleteClick = (messageId: number) => {
    setDeleteConfirmId(messageId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId !== null) {
      setMessages(messages.filter((m) => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const stopHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
    stopHold();
  };

  // 5 seconds hold-to-delete, update every 100ms => 50 ticks
  const handleDeleteHoldStart = () => {
    setIsHolding(true);
    setHoldProgress(0);

    let progress = 0;

    holdIntervalRef.current = setInterval(() => {
      progress += 100 / 50;
      const clamped = Math.min(progress, 100);
      setHoldProgress(clamped);

      if (clamped >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        handleConfirmDelete();
      }
    }, 100);
  };

  const handleDeleteHoldEnd = () => {
    // If user releases early, cancel
    stopHold();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/communication")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.title, fontSize: 20, fontWeight: "900" }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.primary : colors.purple }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#FFF", fontWeight: "900" }}>💬</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Messages</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Stay connected with your care team</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Communication */}
          <Pressable
            onPress={() => router.push("/communication")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
              ← Back to Communication & Safety
            </Text>
          </Pressable>

          {/* Messages Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.title }]}>Messages</Text>
            <Text style={[styles.cardSub, { color: colors.sub }]}>Stay connected with your care team</Text>

            <View style={{ marginTop: 14, gap: 12 }}>
              {messages.map((message) => (
                <View key={message.id}>
                  {/* Message card */}
                  <Pressable
                    onPress={() => handleViewHistory(message)}
                    style={({ pressed }) => [
                      styles.messageCard,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF",
                        borderColor: highContrastMode ? colors.border : colors.borderSoft,
                      },
                      pressed && { opacity: 0.95 },
                    ]}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {/* Icon */}
                      <View style={{ paddingTop: 2 }}>
                        <Text style={{ color: highContrastMode ? colors.primary : colors.purple, fontSize: 18 }}>
                          💬
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                          <Text style={{ fontWeight: "900", color: highContrastMode ? "#fff" : "#101828", flex: 1 }} numberOfLines={1}>
                            {message.sender}
                          </Text>
                          <Text style={{ color: highContrastMode ? colors.primary : colors.sub, fontWeight: "800" }}>
                            {message.time}
                          </Text>
                        </View>

                        <Text style={{ marginTop: 8, color: highContrastMode ? "#fff" : "#101828", fontWeight: "700" }}>
                          {message.message}
                        </Text>

                        {/* Reply preview */}
                        {message.userReply ? (
                          <View
                            style={[
                              styles.replyPreview,
                              {
                                backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                                borderColor: highContrastMode ? colors.border : "#D1D5DB",
                              },
                            ]}
                          >
                            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280", fontSize: 12 }}>
                              ↳ You replied
                            </Text>
                            <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? "#fff" : "#101828" }}>
                              {message.userReply}
                            </Text>
                          </View>
                        ) : null}

                        {/* Actions */}
                        <View
                          style={[
                            styles.actionGroup,
                            { backgroundColor: highContrastMode ? "#1a1a1a" : "#F9FAFB", borderColor: colors.divider },
                          ]}
                        >
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleReply(message.id);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: highContrastMode ? colors.primary : colors.primary, fontWeight: "900", fontSize: 13 }}>
                              Reply
                            </Text>
                          </Pressable>

                          <View style={[styles.vDivider, { backgroundColor: colors.divider }]} />

                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleViewHistory(message);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "900", fontSize: 13 }}>
                              History
                            </Text>
                          </Pressable>

                          <View style={[styles.vDivider, { backgroundColor: colors.divider }]} />

                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(message.id);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: colors.danger, fontWeight: "900", fontSize: 13 }}>
                              Delete
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Pressable>

                  {/* Reply field */}
                  {replyingTo === message.id && (
                    <View
                      style={[
                        styles.replyBox,
                        {
                          backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: highContrastMode ? colors.primary : "#6B7280", fontWeight: "900", marginBottom: 10 }}>
                        Replying to {message.sender}
                      </Text>

                      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <TextInput
                          value={replyText}
                          onChangeText={setReplyText}
                          placeholder="Type your reply..."
                          placeholderTextColor={highContrastMode ? "#AAAAAA" : "#9CA3AF"}
                          autoFocus
                          returnKeyType="send"
                          onSubmitEditing={() => {
                            if (replyText.trim()) handleSendReply(message.id);
                          }}
                          style={[
                            styles.input,
                            {
                              backgroundColor: colors.inputBg,
                              borderColor: highContrastMode ? colors.border : "#E5E7EB",
                              color: highContrastMode ? "#fff" : "#101828",
                            },
                          ]}
                        />

                        <Pressable
                          onPress={() => handleSendReply(message.id)}
                          disabled={!replyText.trim()}
                          style={({ pressed }) => [
                            styles.sendBtn,
                            {
                              backgroundColor: highContrastMode ? colors.primary : colors.primary,
                              opacity: !replyText.trim() ? 0.5 : pressed ? 0.9 : 1,
                            },
                          ]}
                        >
                          <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>Send</Text>
                        </Pressable>

                        <Pressable
                          onPress={handleCancelReply}
                          style={({ pressed }) => [
                            styles.cancelIconBtn,
                            {
                              borderColor: colors.border,
                              backgroundColor: pressed ? (highContrastMode ? "#333" : "#F3F4F6") : "transparent",
                            },
                          ]}
                        >
                          <Text style={{ color: highContrastMode ? colors.primary : "#6B7280", fontWeight: "900" }}>
                            ✕
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}

              {messages.length === 0 && (
                <View style={{ alignItems: "center", paddingVertical: 28 }}>
                  <View style={[styles.emptyIcon, { backgroundColor: highContrastMode ? "#2a2a2a" : "#F3E8FF" }]}>
                    <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : colors.purple }}>
                      💬
                    </Text>
                  </View>
                  <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "900", color: colors.title }}>
                    No messages yet
                  </Text>
                  <Text style={{ marginTop: 6, fontWeight: "800", color: colors.sub }}>
                    Messages from your care team will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* History Modal */}
        <Modal transparent visible={showHistory && !!selectedMessage} animationType="fade" onRequestClose={closeHistory}>
          <View style={[styles.modalBackdrop, { backgroundColor: highContrastMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>Message History</Text>
                  <Text style={{ marginTop: 2, fontWeight: "800", color: colors.sub }}>
                    {selectedMessage?.sender ?? ""}
                  </Text>
                </View>

                <Pressable onPress={closeHistory} style={styles.iconBtn}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280" }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
                {selectedMessage?.conversation?.map((msg) => {
                  const isReply = !!msg.isReply;
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.threadBubble,
                        {
                          backgroundColor: isReply ? colors.historyRightBg : colors.historyLeftBg,
                          borderColor: isReply ? colors.historyRightBorder : colors.historyLeftBorder,
                          alignSelf: isReply ? "flex-end" : "flex-start",
                        },
                      ]}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <Text style={{ fontWeight: "900", color: colors.title }}>{msg.sender}</Text>
                        <Text style={{ fontWeight: "800", color: colors.sub, fontSize: 12 }}>{msg.time}</Text>
                      </View>
                      <Text style={{ marginTop: 6, fontWeight: "800", color: colors.title }}>
                        {msg.message}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <Pressable
                onPress={closeHistory}
                style={({ pressed }) => [
                  styles.closeBtn,
                  {
                    backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                    borderColor: colors.border,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Delete Confirm Modal (hold-to-delete) */}
        <Modal transparent visible={deleteConfirmId !== null} animationType="fade" onRequestClose={handleCancelDelete}>
          <View style={[styles.modalBackdrop, { backgroundColor: highContrastMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title, flex: 1 }}>
                  Delete Message
                </Text>
                <Pressable onPress={handleCancelDelete} style={styles.iconBtn}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280" }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? "#fff" : "#6B7280" }}>
                Are you sure you want to delete this message? This action cannot be undone.
              </Text>

              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: highContrastMode ? "#2a2a2a" : "#FEF2F2",
                    borderColor: highContrastMode ? colors.danger : "#FCA5A5",
                  },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>Message will be deleted</Text>
                <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? "#fff" : "#6B7280" }}>
                  This message will be permanently removed from your messages.
                </Text>
              </View>

              {/* Hold-to-delete button */}
              <View style={{ marginTop: 10 }}>
                <View style={{ position: "relative" }}>
                  {/* Progress fill behind button */}
                  {holdProgress > 0 && (
                    <View style={[styles.progressFill, { width: `${holdProgress}%`, backgroundColor: highContrastMode ? "#991B1B" : "#991B1B" }]} />
                  )}

                  <Pressable
                    onPressIn={handleDeleteHoldStart}
                    onPressOut={handleDeleteHoldEnd}
                    onLongPress={() => {}}
                    delayLongPress={999999}
                    style={({ pressed }) => [
                      styles.deleteBtn,
                      {
                        backgroundColor: colors.danger,
                        opacity: pressed ? 0.95 : 1,
                      },
                    ]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                      {isHolding ? `Hold (${Math.round(holdProgress)}%)` : "Delete Message"}
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleCancelDelete}
                  style={({ pressed }) => [
                    styles.cancelBtn,
                    { backgroundColor: highContrastMode ? "#1a1a1a" : "#fff", borderColor: colors.border, opacity: pressed ? 0.92 : 1 },
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

        {/* Bottom Nav */}
        <View style={[styles.nav, { backgroundColor: colors.headerBg, borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/tasks")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/health")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Health</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/messages")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? colors.primary : colors.primary, fontWeight: "900" }}>Messages</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/alerts")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Alerts</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
            </Pressable>
          </View>
        </View>
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

  cardTitle: { fontSize: 18, fontWeight: "900" },
  cardSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  messageCard: { borderWidth: 2, borderRadius: 18, padding: 14 },

  replyPreview: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },

  actionGroup: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  vDivider: { width: 1, height: 16 },

  replyBox: { marginTop: 10, borderWidth: 1, borderRadius: 18, padding: 14 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontWeight: "800",
  },
  sendBtn: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cancelIconBtn: { width: 44, height: 44, borderWidth: 1, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  emptyIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },

  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 420, borderRadius: 18, padding: 16 },
  modalHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  threadBubble: { borderWidth: 1, borderRadius: 14, padding: 12, maxWidth: "92%" },

  closeBtn: { marginTop: 12, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },

  warningBox: { marginTop: 12, borderWidth: 1, borderRadius: 14, padding: 12 },

  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    opacity: 0.55,
  },
  deleteBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", overflow: "hidden" },
  cancelBtn: { marginTop: 10, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
=======
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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

import { useMessages, type Message } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

export default function MessagesScreen() {
  const { highContrastMode } = useTheme();
  const { messages, setMessages, markAsRead } = useMessages();

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = useMemo(
    () => ({
      bg: highContrastMode ? "#000000" : "#F6F9FF",
      headerBg: highContrastMode ? "#000000" : "#FFFFFF",
      card: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      card2: highContrastMode ? "#2a2a2a" : "#EFF6FF",
      border: highContrastMode ? "#FFFF00" : "#E5E7EB",
      borderSoft: highContrastMode ? "#FFFF00" : "#E0E7FF",
      title: highContrastMode ? "#FFFFFF" : "#101828",
      sub: highContrastMode ? "#FFFF00" : "#6B7280",
      muted: highContrastMode ? "#FFFFFF" : "#6B7280",
      primary: highContrastMode ? "#FFFF00" : "#155DFC",
      purple: "#9333EA",
      danger: "#DC2626",
      dangerDark: "#B91C1C",
      inputBg: highContrastMode ? "#1a1a1a" : "#FFFFFF",
      divider: highContrastMode ? "#FFFF00" : "#E5E7EB",
      historyLeftBg: highContrastMode ? "#1a1a1a" : "#EFF6FF",
      historyRightBg: highContrastMode ? "#2a2a2a" : "#DBEAFE",
      historyLeftBorder: highContrastMode ? "#FFFF00" : "#E0E7FF",
      historyRightBorder: highContrastMode ? "#FFFF00" : "#BFDBFE",
    }),
    [highContrastMode],
  );

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId);
    setReplyText("");
  };

  const handleSendReply = (messageId: number) => {
    if (!replyText.trim()) return;

    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const updatedConversation = msg.conversation ? [...msg.conversation] : [];
          updatedConversation.push({
            id: updatedConversation.length + 1,
            sender: "You",
            message: replyText,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            isReply: true,
          });

          return {
            ...msg,
            userReply: replyText,
            conversation: updatedConversation,
            isRead: true,
          };
        }
        return msg;
      }),
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyText("");
    setReplyingTo(null);
  };

  const handleViewHistory = (message: Message) => {
    setSelectedMessage(message);
    setShowHistory(true);
    markAsRead(message.id);
  };

  const closeHistory = () => {
    setShowHistory(false);
    setSelectedMessage(null);
  };

  const handleDeleteClick = (messageId: number) => {
    setDeleteConfirmId(messageId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId !== null) {
      setMessages(messages.filter((m) => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const stopHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
    stopHold();
  };

  // 5 seconds hold-to-delete, update every 100ms => 50 ticks
  const handleDeleteHoldStart = () => {
    setIsHolding(true);
    setHoldProgress(0);

    let progress = 0;

    holdIntervalRef.current = setInterval(() => {
      progress += 100 / 50;
      const clamped = Math.min(progress, 100);
      setHoldProgress(clamped);

      if (clamped >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setIsHolding(false);
        setHoldProgress(0);
        handleConfirmDelete();
      }
    }, 100);
  };

  const handleDeleteHoldEnd = () => {
    // If user releases early, cancel
    stopHold();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.push("/communication")} style={styles.iconBtn}>
              <Text style={{ color: highContrastMode ? "#FFFFFF" : colors.title, fontSize: 20, fontWeight: "900" }}>
                ←
              </Text>
            </Pressable>

            <View style={[styles.headerIcon, { backgroundColor: highContrastMode ? colors.primary : colors.purple }]}>
              <Text style={{ color: highContrastMode ? "#000" : "#FFF", fontWeight: "900" }}>💬</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>Messages</Text>
              <Text style={[styles.headerSub, { color: colors.sub }]}>Stay connected with your care team</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back to Communication */}
          <Pressable
            onPress={() => router.push("/communication")}
            style={({ pressed }) => [
              styles.backCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
              ← Back to Communication & Safety
            </Text>
          </Pressable>

          {/* Messages Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.title }]}>Messages</Text>
            <Text style={[styles.cardSub, { color: colors.sub }]}>Stay connected with your care team</Text>

            <View style={{ marginTop: 14, gap: 12 }}>
              {messages.map((message) => (
                <View key={message.id}>
                  {/* Message card */}
                  <Pressable
                    onPress={() => handleViewHistory(message)}
                    style={({ pressed }) => [
                      styles.messageCard,
                      {
                        backgroundColor: highContrastMode ? "#2a2a2a" : "#EFF6FF",
                        borderColor: highContrastMode ? colors.border : colors.borderSoft,
                      },
                      pressed && { opacity: 0.95 },
                    ]}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {/* Icon */}
                      <View style={{ paddingTop: 2 }}>
                        <Text style={{ color: highContrastMode ? colors.primary : colors.purple, fontSize: 18 }}>
                          💬
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                          <Text style={{ fontWeight: "900", color: highContrastMode ? "#fff" : "#101828", flex: 1 }} numberOfLines={1}>
                            {message.sender}
                          </Text>
                          <Text style={{ color: highContrastMode ? colors.primary : colors.sub, fontWeight: "800" }}>
                            {message.time}
                          </Text>
                        </View>

                        <Text style={{ marginTop: 8, color: highContrastMode ? "#fff" : "#101828", fontWeight: "700" }}>
                          {message.message}
                        </Text>

                        {/* Reply preview */}
                        {message.userReply ? (
                          <View
                            style={[
                              styles.replyPreview,
                              {
                                backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                                borderColor: highContrastMode ? colors.border : "#D1D5DB",
                              },
                            ]}
                          >
                            <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280", fontSize: 12 }}>
                              ↳ You replied
                            </Text>
                            <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? "#fff" : "#101828" }}>
                              {message.userReply}
                            </Text>
                          </View>
                        ) : null}

                        {/* Actions */}
                        <View
                          style={[
                            styles.actionGroup,
                            { backgroundColor: highContrastMode ? "#1a1a1a" : "#F9FAFB", borderColor: colors.divider },
                          ]}
                        >
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleReply(message.id);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: highContrastMode ? colors.primary : colors.primary, fontWeight: "900", fontSize: 13 }}>
                              Reply
                            </Text>
                          </Pressable>

                          <View style={[styles.vDivider, { backgroundColor: colors.divider }]} />

                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleViewHistory(message);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "900", fontSize: 13 }}>
                              History
                            </Text>
                          </Pressable>

                          <View style={[styles.vDivider, { backgroundColor: colors.divider }]} />

                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(message.id);
                            }}
                            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.85 }]}
                          >
                            <Text style={{ color: colors.danger, fontWeight: "900", fontSize: 13 }}>
                              Delete
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Pressable>

                  {/* Reply field */}
                  {replyingTo === message.id && (
                    <View
                      style={[
                        styles.replyBox,
                        {
                          backgroundColor: highContrastMode ? "#2a2a2a" : "#F9FAFB",
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: highContrastMode ? colors.primary : "#6B7280", fontWeight: "900", marginBottom: 10 }}>
                        Replying to {message.sender}
                      </Text>

                      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <TextInput
                          value={replyText}
                          onChangeText={setReplyText}
                          placeholder="Type your reply..."
                          placeholderTextColor={highContrastMode ? "#AAAAAA" : "#9CA3AF"}
                          autoFocus
                          returnKeyType="send"
                          onSubmitEditing={() => {
                            if (replyText.trim()) handleSendReply(message.id);
                          }}
                          style={[
                            styles.input,
                            {
                              backgroundColor: colors.inputBg,
                              borderColor: highContrastMode ? colors.border : "#E5E7EB",
                              color: highContrastMode ? "#fff" : "#101828",
                            },
                          ]}
                        />

                        <Pressable
                          onPress={() => handleSendReply(message.id)}
                          disabled={!replyText.trim()}
                          style={({ pressed }) => [
                            styles.sendBtn,
                            {
                              backgroundColor: highContrastMode ? colors.primary : colors.primary,
                              opacity: !replyText.trim() ? 0.5 : pressed ? 0.9 : 1,
                            },
                          ]}
                        >
                          <Text style={{ fontWeight: "900", color: highContrastMode ? "#000" : "#fff" }}>Send</Text>
                        </Pressable>

                        <Pressable
                          onPress={handleCancelReply}
                          style={({ pressed }) => [
                            styles.cancelIconBtn,
                            {
                              borderColor: colors.border,
                              backgroundColor: pressed ? (highContrastMode ? "#333" : "#F3F4F6") : "transparent",
                            },
                          ]}
                        >
                          <Text style={{ color: highContrastMode ? colors.primary : "#6B7280", fontWeight: "900" }}>
                            ✕
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}

              {messages.length === 0 && (
                <View style={{ alignItems: "center", paddingVertical: 28 }}>
                  <View style={[styles.emptyIcon, { backgroundColor: highContrastMode ? "#2a2a2a" : "#F3E8FF" }]}>
                    <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : colors.purple }}>
                      💬
                    </Text>
                  </View>
                  <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "900", color: colors.title }}>
                    No messages yet
                  </Text>
                  <Text style={{ marginTop: 6, fontWeight: "800", color: colors.sub }}>
                    Messages from your care team will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* History Modal */}
        <Modal transparent visible={showHistory && !!selectedMessage} animationType="fade" onRequestClose={closeHistory}>
          <View style={[styles.modalBackdrop, { backgroundColor: highContrastMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title }}>Message History</Text>
                  <Text style={{ marginTop: 2, fontWeight: "800", color: colors.sub }}>
                    {selectedMessage?.sender ?? ""}
                  </Text>
                </View>

                <Pressable onPress={closeHistory} style={styles.iconBtn}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280" }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
                {selectedMessage?.conversation?.map((msg) => {
                  const isReply = !!msg.isReply;
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.threadBubble,
                        {
                          backgroundColor: isReply ? colors.historyRightBg : colors.historyLeftBg,
                          borderColor: isReply ? colors.historyRightBorder : colors.historyLeftBorder,
                          alignSelf: isReply ? "flex-end" : "flex-start",
                        },
                      ]}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <Text style={{ fontWeight: "900", color: colors.title }}>{msg.sender}</Text>
                        <Text style={{ fontWeight: "800", color: colors.sub, fontSize: 12 }}>{msg.time}</Text>
                      </View>
                      <Text style={{ marginTop: 6, fontWeight: "800", color: colors.title }}>
                        {msg.message}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <Pressable
                onPress={closeHistory}
                style={({ pressed }) => [
                  styles.closeBtn,
                  {
                    backgroundColor: highContrastMode ? "#1a1a1a" : "#fff",
                    borderColor: colors.border,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <Text style={{ fontWeight: "900", color: highContrastMode ? colors.primary : colors.title }}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Delete Confirm Modal (hold-to-delete) */}
        <Modal transparent visible={deleteConfirmId !== null} animationType="fade" onRequestClose={handleCancelDelete}>
          <View style={[styles.modalBackdrop, { backgroundColor: highContrastMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrastMode ? 2 : 0 }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={{ fontSize: 18, fontWeight: "900", color: colors.title, flex: 1 }}>
                  Delete Message
                </Text>
                <Pressable onPress={handleCancelDelete} style={styles.iconBtn}>
                  <Text style={{ fontSize: 18, fontWeight: "900", color: highContrastMode ? colors.primary : "#6B7280" }}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              <Text style={{ marginTop: 6, fontWeight: "800", color: highContrastMode ? "#fff" : "#6B7280" }}>
                Are you sure you want to delete this message? This action cannot be undone.
              </Text>

              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: highContrastMode ? "#2a2a2a" : "#FEF2F2",
                    borderColor: highContrastMode ? colors.danger : "#FCA5A5",
                  },
                ]}
              >
                <Text style={{ fontWeight: "900", color: colors.title }}>Message will be deleted</Text>
                <Text style={{ marginTop: 4, fontWeight: "800", color: highContrastMode ? "#fff" : "#6B7280" }}>
                  This message will be permanently removed from your messages.
                </Text>
              </View>

              {/* Hold-to-delete button */}
              <View style={{ marginTop: 10 }}>
                <View style={{ position: "relative" }}>
                  {/* Progress fill behind button */}
                  {holdProgress > 0 && (
                    <View style={[styles.progressFill, { width: `${holdProgress}%`, backgroundColor: highContrastMode ? "#991B1B" : "#991B1B" }]} />
                  )}

                  <Pressable
                    onPressIn={handleDeleteHoldStart}
                    onPressOut={handleDeleteHoldEnd}
                    onLongPress={() => {}}
                    delayLongPress={999999}
                    style={({ pressed }) => [
                      styles.deleteBtn,
                      {
                        backgroundColor: colors.danger,
                        opacity: pressed ? 0.95 : 1,
                      },
                    ]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                      {isHolding ? `Hold (${Math.round(holdProgress)}%)` : "Delete Message"}
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleCancelDelete}
                  style={({ pressed }) => [
                    styles.cancelBtn,
                    { backgroundColor: highContrastMode ? "#1a1a1a" : "#fff", borderColor: colors.border, opacity: pressed ? 0.92 : 1 },
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

        {/* Bottom Nav */}
        <View style={[styles.nav, { backgroundColor: colors.headerBg, borderTopColor: colors.border }]}>
          <View style={styles.navRow}>
            <Pressable onPress={() => router.push("/dashboard")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Home</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/tasks")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Tasks</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/health")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Health</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/messages")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? colors.primary : colors.primary, fontWeight: "900" }}>Messages</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/alerts")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Alerts</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
              <Text style={{ color: highContrastMode ? "#fff" : "#6B7280", fontWeight: "800" }}>Profile</Text>
            </Pressable>
          </View>
        </View>
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

  cardTitle: { fontSize: 18, fontWeight: "900" },
  cardSub: { marginTop: 2, fontSize: 13, fontWeight: "800" },

  messageCard: { borderWidth: 2, borderRadius: 18, padding: 14 },

  replyPreview: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },

  actionGroup: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  vDivider: { width: 1, height: 16 },

  replyBox: { marginTop: 10, borderWidth: 1, borderRadius: 18, padding: 14 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontWeight: "800",
  },
  sendBtn: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cancelIconBtn: { width: 44, height: 44, borderWidth: 1, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  emptyIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },

  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 420, borderRadius: 18, padding: 16 },
  modalHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  threadBubble: { borderWidth: 1, borderRadius: 14, padding: 12, maxWidth: "92%" },

  closeBtn: { marginTop: 12, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },

  warningBox: { marginTop: 12, borderWidth: 1, borderRadius: 14, padding: 12 },

  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    opacity: 0.55,
  },
  deleteBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", overflow: "hidden" },
  cancelBtn: { marginTop: 10, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },

  nav: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingVertical: 10 },
  navRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  navItem: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6, paddingVertical: 6 },
});
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
