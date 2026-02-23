import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { ChatTheme } from "../types";
import { moderateScale } from "../utils/scaling";

interface LoadEarlierProps {
  onLoadEarlier: () => void;
  isLoading: boolean;
  label: string;
  theme: ChatTheme;
}

const LoadEarlierComponent: React.FC<LoadEarlierProps> = ({
  onLoadEarlier,
  isLoading,
  label,
  theme,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: theme.colors.border }]}
      onPress={onLoadEarlier}
      disabled={isLoading}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.primary,
              fontSize: theme.fontSize.sm,
              fontFamily: theme.fonts.medium,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(12),
    marginVertical: moderateScale(8),
    marginHorizontal: moderateScale(40),
    borderRadius: moderateScale(20),
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
  },
});

export const LoadEarlier = memo(LoadEarlierComponent);
