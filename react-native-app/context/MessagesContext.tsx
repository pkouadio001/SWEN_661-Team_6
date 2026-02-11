import React, { createContext, useContext, useMemo, useState } from "react";

export type Message = {
  id: number;
  sender: string;
  message: string;
  time: string;
  isRead?: boolean;
  userReply?: string;
  conversation?: Array<{
    id: number;
    sender: string;
    message: string;
    time: string;
    isReply?: boolean;
  }>;
};

type MessagesContextValue = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  markAsRead: (id: number) => void;

  unreadCount: number;
  getUnreadCount: () => number; // ✅ add this (so dashboard can call it)
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Dr. Sarah Smith",
    message: "Hi John, how are you feeling today?",
    time: "9:12 AM",
    isRead: false,
    conversation: [
      { id: 1, sender: "Dr. Sarah Smith", message: "Hi John, how are you feeling today?", time: "9:12 AM" },
    ],
  },
  {
    id: 2,
    sender: "Care Team",
    message: "Reminder: please log your blood pressure today.",
    time: "8:05 AM",
    isRead: true,
    conversation: [
      { id: 1, sender: "Care Team", message: "Reminder: please log your blood pressure today.", time: "8:05 AM" },
    ],
  },
];

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const markAsRead = (id: number) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  const getUnreadCount = () => unreadCount;

  const value = useMemo(
    () => ({ messages, setMessages, markAsRead, unreadCount, getUnreadCount }),
    [messages, unreadCount]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used inside <MessagesProvider />");
  return ctx;
}
