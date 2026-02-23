import React, { memo } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import type { MessageRowProps } from "../types";
import { MessageBubble } from "./MessageBubble";
import { Avatar } from "./Avatar";
import { useAnimatedMessage } from "../hooks/useAnimatedMessage";
import { moderateScale } from "../utils/scaling";

const AVATAR_SIZE = moderateScale(34);
const AVATAR_SPACING = moderateScale(8);

const MessageRowComponent: React.FC<MessageRowProps> = ({
  message,
  isCurrentUser,
  showAvatar,
  theme,
  renderBubble,
  renderAvatar,
  renderMessageStatus,
  animateMessages = false,
  timeFormat,
}) => {
  const { opacity, translateY } = useAnimatedMessage(animateMessages);

  const bubbleProps = {
    message,
    isCurrentUser,
    showAvatar,
    theme,
    renderMessageStatus,
    timeFormat,
  };

  const avatarProps = {
    user: message.user,
    size: AVATAR_SIZE,
    theme,
  };

  const avatarPlaceholder = (
    <View
      style={{ width: AVATAR_SIZE, marginHorizontal: AVATAR_SPACING / 2 }}
    />
  );

  const avatarElement = showAvatar ? (
    <View style={styles.avatarContainer}>
      {renderAvatar ? renderAvatar(avatarProps) : <Avatar {...avatarProps} />}
    </View>
  ) : (
    avatarPlaceholder
  );

  const showSenderName = !isCurrentUser && showAvatar && message.user.name;

  return (
    <Animated.View
      style={[
        styles.row,
        isCurrentUser ? styles.rowRight : styles.rowLeft,
        animateMessages ? { opacity, transform: [{ translateY }] } : undefined,
      ]}
    >
      {!isCurrentUser && avatarElement}

      <View
        style={[
          styles.bubbleWrapper,
          isCurrentUser && styles.sentBubbleWrapper,
        ]}
      >
        {showSenderName && (
          <Text
            style={[
              styles.senderName,
              {
                color: theme.colors.primary,
                fontSize: theme.fontSize.xs,
                fontFamily: theme.fonts.medium,
              },
            ]}
            numberOfLines={1}
          >
            {message.user.name}
          </Text>
        )}
        {renderBubble ? (
          renderBubble(bubbleProps)
        ) : (
          <MessageBubble {...bubbleProps} />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: moderateScale(3),
    paddingHorizontal: moderateScale(10),
  },
  rowLeft: {
    justifyContent: "flex-start",
    paddingRight: moderateScale(48),
  },
  rowRight: {
    justifyContent: "flex-end",
    paddingLeft: moderateScale(48),
  },
  avatarContainer: {
    marginHorizontal: AVATAR_SPACING / 2,
    marginBottom: moderateScale(2),
  },
  bubbleWrapper: {
    flexShrink: 1,
  },
  sentBubbleWrapper: {
    alignItems: "flex-end",
  },
  senderName: {
    fontWeight: "600",
    marginBottom: moderateScale(2),
    marginLeft: moderateScale(4),
    letterSpacing: moderateScale(0.2),
  },
});

export const MessageRow = memo(MessageRowComponent);
