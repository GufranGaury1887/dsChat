import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { SystemMessageProps } from "../types";
import { moderateScale } from "../utils/scaling";

const SystemMessageComponent: React.FC<SystemMessageProps> = ({
  message,
  theme,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.systemMessage,
            fontSize: theme.fontSize.sm,
            fontFamily: theme.fonts.regular,
          },
          textStyle,
        ]}
      >
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(8),
    paddingHorizontal: moderateScale(24),
  },
  text: {
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: moderateScale(18),
  },
});

export const SystemMessage = memo(SystemMessageComponent);
