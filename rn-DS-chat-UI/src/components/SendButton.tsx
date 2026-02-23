import React, { memo, useCallback, useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import type { SendButtonProps } from "../types";
import { moderateScale } from "../utils/scaling";

const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.iconContainer}>
    <View
      style={[
        styles.arrow,
        {
          borderLeftColor: color,
        },
      ]}
    />
  </View>
);

const SendButtonComponent: React.FC<SendButtonProps> = ({
  disabled,
  onSend,
  theme,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.88,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const buttonColor = disabled
    ? theme.colors.sendButtonDisabled
    : theme.colors.sendButton;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }, style]}
        onPress={onSend}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityLabel="Send message"
        accessibilityRole="button"
      >
        <SendIcon color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: moderateScale(20),
    height: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
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

export const SendButton = memo(SendButtonComponent);
