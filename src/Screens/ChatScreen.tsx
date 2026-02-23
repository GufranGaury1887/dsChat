import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
  Keyboard,
} from "react-native";
import {
  Chat,
  Message,
  InputToolbarProps,
  MessageBubbleProps,
  MessageStatus,
  formatTime,
} from "../../rn-DS-chat-UI/src";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "../utils/scaling";

// ─── Status Icon ─────────────────────────────────────────────────────
const StatusIcon: React.FC<{
  status: MessageStatus;
  sentColor: string;
  deliveredColor: string;
  readColor: string;
}> = ({ status, sentColor, deliveredColor, readColor }) => {
  const getStatusDisplay = (): { text: string; color: string } => {
    switch (status) {
      case "sending":
        return { text: "○", color: "rgba(255,255,255,0.4)" };
      case "sent":
        return { text: "✓", color: sentColor };
      case "delivered":
        return { text: "✓✓", color: deliveredColor };
      case "read":
        return { text: "✓✓", color: readColor };
      case "failed":
        return { text: "⚠", color: "#FF453A" };
      default:
        return { text: "", color: "transparent" };
    }
  };

  const { text, color } = getStatusDisplay();
  return <Text style={[bubbleStyles.statusText, { color }]}>{text}</Text>;
};

// ─── Custom Message Bubble ───────────────────────────────────────────
const CustomMessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  theme,
  renderMessageStatus,
  style,
  textStyle,
  timeStyle,
  timeFormat,
}) => {
  const bubbleStyle = useMemo(
    () => [
      isCurrentUser ? bubbleStyles.sentBubble : bubbleStyles.receivedBubble,
      {
        backgroundColor: isCurrentUser
          ? theme.colors.sentBubble
          : theme.colors.receivedBubble,
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        borderBottomLeftRadius: isCurrentUser
          ? moderateScale(20)
          : moderateScale(4),
        borderBottomRightRadius: isCurrentUser
          ? moderateScale(4)
          : moderateScale(20),
      },
      isCurrentUser && bubbleStyles.sentShadow,
      style,
    ],
    [isCurrentUser, theme, style],
  );

  const messageTextStyle = useMemo(
    () => [
      bubbleStyles.messageText,
      {
        color: isCurrentUser
          ? theme.colors.sentBubbleText
          : theme.colors.receivedBubbleText,
        fontSize: theme.fontSize.md,
        fontFamily: theme.fonts.regular,
      },
      textStyle,
    ],
    [isCurrentUser, theme, textStyle],
  );

  return (
    <View style={bubbleStyle}>
      {/* Subtle top gradient highlight on sent bubbles */}
      {isCurrentUser && (
        <View
          style={[
            bubbleStyles.sentHighlight,
            {
              backgroundColor: "rgba(255,255,255,0.06)",
              borderTopLeftRadius: moderateScale(20),
              borderTopRightRadius: moderateScale(20),
            },
          ]}
        />
      )}

      {/* Image attachment */}
      {message.image && (
        <Image
          source={{ uri: message.image }}
          style={bubbleStyles.messageImage}
          resizeMode="cover"
        />
      )}

      {/* Message text */}
      {message.text ? (
        <Text style={messageTextStyle}>{message.text}</Text>
      ) : null}

      {/* Meta row: timestamp + status */}
      <View
        style={[
          bubbleStyles.metaRow,
          isCurrentUser && bubbleStyles.sentMetaRow,
        ]}
      >
        <Text
          style={[
            bubbleStyles.timestamp,
            {
              color: isCurrentUser
                ? "rgba(255,255,255,0.5)"
                : theme.colors.timestamp,
              fontSize: theme.fontSize.xs,
              fontFamily: theme.fonts.regular,
            },
            timeStyle,
          ]}
        >
          {formatTime(message.createdAt, timeFormat)}
        </Text>

        {isCurrentUser && message.status && (
          <View style={bubbleStyles.statusContainer}>
            {renderMessageStatus ? (
              renderMessageStatus(message.status)
            ) : (
              <StatusIcon
                status={message.status}
                sentColor="rgba(255,255,255,0.55)"
                deliveredColor={theme.colors.statusDelivered}
                readColor={theme.colors.statusRead}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Custom Send Icon ────────────────────────────────────────────────
const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={toolbarStyles.sendIconContainer}>
    <View style={[toolbarStyles.sendArrow, { borderLeftColor: color }]} />
  </View>
);

// ─── Attachment Icon (Plus) ──────────────────────────────────────────
const AttachmentIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={toolbarStyles.attachIconContainer}>
    <View
      style={[toolbarStyles.attachHorizontal, { backgroundColor: color }]}
    />
    <View style={[toolbarStyles.attachVertical, { backgroundColor: color }]} />
  </View>
);

// ─── Custom Input Toolbar ────────────────────────────────────────────
const CustomInputToolbar: React.FC<InputToolbarProps> = ({
  text,
  onTextChanged,
  onSend,
  placeholder = "Type a message...",
  theme,
}) => {
  const inputRef = useRef<TextInput>(null);
  const sendScale = useRef(new Animated.Value(1)).current;

  const isSendDisabled = text.trim().length === 0;
  const hasText = text.trim().length > 0;

  const handleSend = useCallback(() => {
    if (text.trim().length === 0) return;
    onSend();
    inputRef.current?.clear();
  }, [text, onSend]);

  const handlePressIn = useCallback(() => {
    Animated.spring(sendScale, {
      toValue: 0.85,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [sendScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(sendScale, {
      toValue: 1,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [sendScale]);

  return (
    <View
      style={[
        toolbarStyles.toolbarContainer,
        {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <View style={toolbarStyles.inputRow}>
        {/* Attachment Button */}
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            Alert.alert("Attachment button pressed");
          }}
          style={[
            toolbarStyles.attachButton,
            { backgroundColor: theme.colors.inputBackground },
          ]}
          activeOpacity={0.7}
          accessibilityLabel="Add attachment"
        >
          <AttachmentIcon color={theme.colors.inputPlaceholder} />
        </TouchableOpacity>

        {/* Input Field */}
        <View
          style={[
            toolbarStyles.inputWrapper,
            {
              backgroundColor: theme.colors.inputBackground,
              borderRadius: theme.borderRadius.input,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[
              toolbarStyles.textInput,
              {
                color: theme.colors.inputText,
                fontSize: theme.fontSize.md,
                fontFamily: theme.fonts.regular,
              },
            ]}
            value={text}
            onChangeText={onTextChanged}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.inputPlaceholder}
            multiline
            textAlignVertical="center"
            returnKeyType="default"
            enablesReturnKeyAutomatically
            accessibilityLabel="Message input"
          />
        </View>

        {/* Send Button */}
        {hasText && (
          <Animated.View style={{ transform: [{ scale: sendScale }] }}>
            <TouchableOpacity
              style={[
                toolbarStyles.sendButton,
                {
                  backgroundColor: isSendDisabled
                    ? theme.colors.sendButtonDisabled
                    : theme.colors.sendButton,
                },
              ]}
              onPress={handleSend}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isSendDisabled}
              activeOpacity={0.8}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <SendIcon color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

// ─── Chat Screen ─────────────────────────────────────────────────────
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: 1,
      text: "Hello developer",
      createdAt: new Date(),
      user: {
        _id: 6,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    },
    {
      _id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      createdAt: new Date(),
      user: {
        _id: 5,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    },
    {
      _id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      createdAt: new Date(),
      user: {
        _id: 4,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    },
  ]);

  const currentUser = { _id: "1", name: "You" };

  const onSend = useCallback((newMessages: Message[]) => {
    setMessages((previousMessages) =>
      Chat.append(previousMessages, newMessages),
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Chat
        messages={messages}
        user={currentUser}
        onSend={onSend}
        placeholder="Type a message..."
        isTyping={false}
        animateMessages={true}
        renderBubble={(props) => <CustomMessageBubble {...props} />}
        renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
      />
    </SafeAreaView>
  );
}

// ─── Screen Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

// ─── Custom Bubble Styles ────────────────────────────────────────────
const bubbleStyles = StyleSheet.create({
  sentBubble: {
    maxWidth: moderateScale(260),
    minWidth: moderateScale(80),
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(8),
    marginVertical: moderateScale(2),
  },
  receivedBubble: {
    maxWidth: moderateScale(260),
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(8),
    marginVertical: moderateScale(2),
  },
  sentShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: moderateScale(3) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(6),
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sentHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    overflow: "hidden",
  },
  messageText: {
    lineHeight: moderateScale(22),
    letterSpacing: moderateScale(0.15),
  },
  messageImage: {
    width: moderateScale(200),
    height: moderateScale(150),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(6),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: moderateScale(4),
    gap: moderateScale(4),
  },
  sentMetaRow: {
    marginTop: moderateScale(5),
  },
  timestamp: {
    letterSpacing: moderateScale(0.3),
  },
  statusContainer: {
    marginLeft: moderateScale(2),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: "700",
    letterSpacing: moderateScale(-0.5),
  },
});

// ─── Custom Input Toolbar Styles ─────────────────────────────────────
const toolbarStyles = StyleSheet.create({
  toolbarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(8),
    paddingBottom: Platform.OS === "ios" ? moderateScale(8) : moderateScale(8),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: moderateScale(8),
  },
  attachButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  attachIconContainer: {
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  attachHorizontal: {
    position: "absolute",
    width: moderateScale(16),
    height: moderateScale(2),
    borderRadius: moderateScale(1),
  },
  attachVertical: {
    position: "absolute",
    width: moderateScale(2),
    height: moderateScale(16),
    borderRadius: moderateScale(1),
  },
  inputWrapper: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(120),
    justifyContent: "center",
  },
  textInput: {
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === "ios" ? moderateScale(10) : moderateScale(8),
    paddingBottom: Platform.OS === "ios" ? moderateScale(10) : moderateScale(8),
    lineHeight: moderateScale(20),
    maxHeight: moderateScale(120),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  sendIconContainer: {
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  sendArrow: {
    width: 0,
    height: 0,
    borderTopWidth: moderateScale(7),
    borderBottomWidth: moderateScale(7),
    borderLeftWidth: moderateScale(12),
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: moderateScale(3),
  },
});
