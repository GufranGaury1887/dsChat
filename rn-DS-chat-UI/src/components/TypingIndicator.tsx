import React, { memo, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Easing } from "react-native";
import type { TypingIndicatorProps } from "../types";
import { moderateScale } from "../utils/scaling";

const DOT_SIZE = moderateScale(6);
const ANIMATION_DURATION = 600;

const TypingDot: React.FC<{ delay: number; color: string }> = ({
  delay,
  color,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: ANIMATION_DURATION / 2,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -4,
              duration: ANIMATION_DURATION / 2,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: ANIMATION_DURATION / 2,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: ANIMATION_DURATION / 2,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    };

    animate();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

const TypingIndicatorComponent: React.FC<TypingIndicatorProps> = ({
  isTyping,
  typingUser,
  theme,
  style,
}) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: isTyping ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isTyping, containerOpacity]);

  if (!isTyping) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity: containerOpacity }, style]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.receivedBubble,
            borderRadius: theme.borderRadius.bubble,
          },
        ]}
      >
        <View style={styles.dotsContainer}>
          <TypingDot delay={0} color={theme.colors.typingIndicator} />
          <TypingDot
            delay={ANIMATION_DURATION / 3}
            color={theme.colors.typingIndicator}
          />
          <TypingDot
            delay={(ANIMATION_DURATION / 3) * 2}
            color={theme.colors.typingIndicator}
          />
        </View>
      </View>
      {typingUser?.name && (
        <Text
          style={[
            styles.typingText,
            {
              color: theme.colors.typingIndicator,
              fontSize: theme.fontSize.xs,
              fontFamily: theme.fonts.regular,
            },
          ]}
        >
          {typingUser.name} is typing...
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(4),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  bubble: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
  },
  dotsContainer: {
    flexDirection: "row",
    gap: moderateScale(4),
    alignItems: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  typingText: {
    fontStyle: "italic",
  },
});

export const TypingIndicator = memo(TypingIndicatorComponent);
