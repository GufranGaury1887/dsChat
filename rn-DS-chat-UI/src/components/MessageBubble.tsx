import React, { memo, useMemo } from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import type { MessageBubbleProps, MessageStatus } from "../types";
import { formatTime } from "../utils/dateUtils";
import { moderateScale } from "../utils/scaling";

const StatusIcon: React.FC<{
  status: MessageStatus;
  theme: MessageBubbleProps["theme"];
}> = ({ status, theme }) => {
  const getStatusDisplay = (): { text: string; color: string } => {
    switch (status) {
      case "sending":
        return { text: "○", color: "rgba(255,255,255,0.45)" };
      case "sent":
        return { text: "✓", color: "rgba(255,255,255,0.55)" };
      case "delivered":
        return { text: "✓✓", color: theme.colors.statusDelivered };
      case "read":
        return { text: "✓✓", color: theme.colors.statusRead };
      case "failed":
        return { text: "⚠", color: "#FF453A" };
      default:
        return { text: "", color: "transparent" };
    }
  };

  const { text, color } = getStatusDisplay();

  return <Text style={[styles.statusText, { color }]}>{text}</Text>;
};

const MessageBubbleComponent: React.FC<MessageBubbleProps> = ({
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
      isCurrentUser ? styles.sentBubble : styles.receivedBubble,
      {
        backgroundColor: isCurrentUser
          ? theme.colors.sentBubble
          : theme.colors.receivedBubble,
        borderTopLeftRadius: theme.borderRadius.bubble,
        borderTopRightRadius: theme.borderRadius.bubble,
        borderBottomLeftRadius: isCurrentUser ? theme.borderRadius.bubble : 6,
        borderBottomRightRadius: isCurrentUser ? 6 : theme.borderRadius.bubble,
      },
      isCurrentUser && styles.sentShadow,
      style,
    ],
    [isCurrentUser, theme, style],
  );

  const messageTextStyle = useMemo(
    () => [
      styles.messageText,
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
      {isCurrentUser && (
        <View
          style={[
            styles.sentHighlight,
            {
              backgroundColor: "rgba(255,255,255,0.08)",
              borderTopLeftRadius: theme.borderRadius.bubble,
              borderTopRightRadius: theme.borderRadius.bubble,
            },
          ]}
        />
      )}

      {message.image && (
        <Image
          source={{ uri: message.image }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      )}

      {message.text ? (
        <Text style={messageTextStyle}>{message.text}</Text>
      ) : null}

      <View style={[styles.metaRow, isCurrentUser && styles.sentMetaRow]}>
        <Text
          style={[
            styles.timestamp,
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
          <View style={styles.statusContainer}>
            {renderMessageStatus ? (
              renderMessageStatus(message.status)
            ) : (
              <StatusIcon status={message.status} theme={theme} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sentBubble: {
    maxWidth: moderateScale(250),
    minWidth: moderateScale(80),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(10),
    marginVertical: moderateScale(2),
  },
  receivedBubble: {
    maxWidth: moderateScale(250),
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(8),
    marginVertical: moderateScale(2),
  },
  sentShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: moderateScale(4) },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(8),
      },
      android: {
        elevation: 6,
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
    marginTop: moderateScale(5),
    gap: moderateScale(5),
  },
  sentMetaRow: {
    marginTop: moderateScale(6),
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

export const MessageBubble = memo(MessageBubbleComponent);
