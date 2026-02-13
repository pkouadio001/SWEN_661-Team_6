import React from "react";
import { Pressable, Text, View } from "react-native";

import { MessagesProvider, useMessages } from "@/context/MessagesContext";
import { fireEvent, render, screen } from "@testing-library/react-native";
/**
 * Test-only consumer component so we can interact with the context.
 */
function Consumer() {
  const { messages, unreadCount, getUnreadCount, markAsRead, setMessages } =
    useMessages();

  return (
    <View>
      {/* Show derived values */}
      <Text testID="unreadCount">{String(unreadCount)}</Text>
      <Text testID="getUnreadCount">{String(getUnreadCount())}</Text>
      <Text testID="messagesLength">{String(messages.length)}</Text>

      {/* Show first message sender and read status */}
      <Text testID="firstSender">{messages[0]?.sender ?? ""}</Text>
      <Text testID="firstIsRead">{String(!!messages[0]?.isRead)}</Text>

      {/* Actions */}
      <Pressable testID="markRead1" onPress={() => markAsRead(1)}>
        <Text>mark 1 read</Text>
      </Pressable>

      <Pressable
        testID="addUnreadMessage"
        onPress={() =>
          setMessages((prev) => [
            ...prev,
            {
              id: 999,
              sender: "New Sender",
              message: "Hello",
              time: "10:00 AM",
              isRead: false,
            },
          ])
        }
      >
        <Text>add unread</Text>
      </Pressable>

      <Pressable
        testID="setAllRead"
        onPress={() =>
          setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })))
        }
      >
        <Text>set all read</Text>
      </Pressable>
    </View>
  );
}
describe("MessagesContext", () => {
  it("exposes initial messages and computed unreadCount/getUnreadCount", () => {
    render(
      <MessagesProvider>
        <Consumer />
      </MessagesProvider>,
    );

    // initialMessages has 2 messages, one unread (id=1)
    expect(screen.getByTestId("messagesLength").props.children).toBe("2");
    expect(screen.getByTestId("unreadCount").props.children).toBe("1");
    expect(screen.getByTestId("getUnreadCount").props.children).toBe("1");

    expect(screen.getByTestId("firstSender").props.children).toBe(
      "Dr. Sarah Smith",
    );
    expect(screen.getByTestId("firstIsRead").props.children).toBe("false");
  });

  it("markAsRead updates message and unread count", () => {
    render(
      <MessagesProvider>
        <Consumer />
      </MessagesProvider>,
    );

    fireEvent.press(screen.getByTestId("markRead1"));

    // id=1 becomes read => unread becomes 0
    expect(screen.getByTestId("firstIsRead").props.children).toBe("true");
    expect(screen.getByTestId("unreadCount").props.children).toBe("0");
    expect(screen.getByTestId("getUnreadCount").props.children).toBe("0");
  });

  it("setMessages can add an unread message and counts update", () => {
    render(
      <MessagesProvider>
        <Consumer />
      </MessagesProvider>,
    );

    // initial unread = 1
    expect(screen.getByTestId("unreadCount").props.children).toBe("1");

    fireEvent.press(screen.getByTestId("addUnreadMessage"));

    // now unread should be 2, and length 3
    expect(screen.getByTestId("messagesLength").props.children).toBe("3");
    expect(screen.getByTestId("unreadCount").props.children).toBe("2");
    expect(screen.getByTestId("getUnreadCount").props.children).toBe("2");
  });

  it("setMessages can mark all as read and counts update", () => {
    render(
      <MessagesProvider>
        <Consumer />
      </MessagesProvider>,
    );

    fireEvent.press(screen.getByTestId("setAllRead"));

    expect(screen.getByTestId("unreadCount").props.children).toBe("0");
    expect(screen.getByTestId("getUnreadCount").props.children).toBe("0");
  });
  it("useMessages throws if used outside provider", () => {
    // Silence expected error output so test logs stay clean
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    function BadConsumer() {
      useMessages();
      return <Text>nope</Text>;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      "useMessages must be used inside <MessagesProvider />",
    );

    spy.mockRestore();
  });
});
