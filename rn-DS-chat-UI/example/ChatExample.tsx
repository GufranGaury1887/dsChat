import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Chat, Message, ChatUser, DARK_THEME } from "../src";

const CURRENT_USER: ChatUser = {
  _id: "user-1",
  name: "Mohammed",
};

const OTHER_USER: ChatUser = {
  _id: "user-2",
  name: "Sarah",
  avatar: "https://i.pravatar.cc/150?img=47",
};

const BOT_USER: ChatUser = {
  _id: "user-3",
  name: "ChatBot",
  avatar: "https://i.pravatar.cc/150?img=68",
};

const INITIAL_MESSAGES: Message[] = [
  {
    _id: "msg-6",
    text: "That sounds great! Let me know if you need any help.",
    createdAt: new Date(),
    user: OTHER_USER,
    status: "read",
  },
  {
    _id: "msg-5",
    text: "I'm working on the new chat UI library. Almost done with the core components!",
    createdAt: new Date(Date.now() - 60 * 1000),
    user: CURRENT_USER,
    status: "read",
  },
  {
    _id: "msg-4",
    text: "Hey! How are you doing today?",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    user: OTHER_USER,
    status: "read",
  },
  {
    _id: "msg-3",
    text: "Welcome to the chat! This is a system message.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: BOT_USER,
    system: true,
  },
  {
    _id: "msg-2",
    text: "This message was sent yesterday to test day separators.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: OTHER_USER,
    status: "delivered",
  },
  {
    _id: "msg-1",
    text: "Hello from three days ago!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    user: CURRENT_USER,
    status: "read",
  },
];

const EARLIER_MESSAGES: Message[] = [
  {
    _id: "msg-old-3",
    text: "This is an older message loaded via infinite scroll.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    user: OTHER_USER,
    status: "read",
  },
  {
    _id: "msg-old-2",
    text: "And here is another one from a week ago.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    user: CURRENT_USER,
    status: "read",
  },
  {
    _id: "msg-old-1",
    text: "First message in the conversation!",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    user: OTHER_USER,
    status: "read",
  },
];

export default function ChatExample() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [hasEarlier, setHasEarlier] = useState(true);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = useCallback((newMessages: Message[]) => {
    const messagesWithStatus = newMessages.map((m) => ({
      ...m,
      status: "sent" as const,
    }));

    setMessages((prev) => [...messagesWithStatus, ...prev]);

    // Simulate the other user typing and replying
    setIsTyping(true);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        _id: `reply-${Date.now()}`,
        text: getAutoReply(newMessages[0]?.text ?? ""),
        createdAt: new Date(),
        user: OTHER_USER,
        status: "sent",
      };
      setMessages((prev) => [reply, ...prev]);

      // Update sent message to "delivered" then "read"
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            messagesWithStatus.some((nm) => nm._id === m._id)
              ? { ...m, status: "delivered" as const }
              : m,
          ),
        );
      }, 1000);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            messagesWithStatus.some((nm) => nm._id === m._id)
              ? { ...m, status: "read" as const }
              : m,
          ),
        );
      }, 2500);
    }, 2000);
  }, []);

  const handleLoadEarlier = useCallback(() => {
    if (!hasEarlier || loadingEarlier) return;
    setLoadingEarlier(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, ...EARLIER_MESSAGES]);
      setHasEarlier(false);
      setLoadingEarlier(false);
    }, 1500);
  }, [hasEarlier, loadingEarlier]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>{/* Header can be customized */}</View>

      <Chat
        messages={messages}
        user={CURRENT_USER}
        onSend={handleSend}
        placeholder="Type a message..."
        showReceiverAvatar
        isTyping={isTyping}
        typingUser={OTHER_USER}
        onLoadEarlier={hasEarlier ? handleLoadEarlier : undefined}
        isLoadingEarlier={loadingEarlier}
        animateMessages
        theme={DARK_THEME}
      />
    </View>
  );
}

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hey there! Nice to hear from you!";
  }
  if (lower.includes("help")) {
    return "Sure, I'm happy to help! What do you need?";
  }
  if (lower.includes("thanks") || lower.includes("thank")) {
    return "You're welcome! 😊";
  }
  const replies = [
    "Interesting! Tell me more.",
    "Got it, thanks for sharing!",
    "That's cool! What else is new?",
    "I see what you mean.",
    "Absolutely, I agree!",
  ];
  return replies[Math.floor(Math.random() * replies.length)]!;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C29",
  },
  header: {
    height: 0,
  },
});
