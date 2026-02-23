import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { DaySeparatorProps } from "../types";
import { formatDayHeader } from "../utils/dateUtils";
import { moderateScale } from "../utils/scaling";

const DaySeparatorComponent: React.FC<DaySeparatorProps> = ({
  date,
  theme,
  dateFormat,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[styles.line, { backgroundColor: theme.colors.daySeparator }]}
      />
      <View
        style={[
          styles.labelContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.daySeparatorText,
              fontSize: theme.fontSize.xs,
              fontFamily: theme.fonts.medium,
            },
            textStyle,
          ]}
        >
          {formatDayHeader(date, dateFormat)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
    position: "relative",
  },
  line: {
    position: "absolute",
    left: moderateScale(40),
    right: moderateScale(40),
    height: StyleSheet.hairlineWidth,
  },
  labelContainer: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  label: {
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: moderateScale(0.8),
  },
});

export const DaySeparator = memo(DaySeparatorComponent);
