import React, { memo, useMemo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { AvatarProps } from "../types";
import { moderateScale } from "../utils/scaling";

const AVATAR_SIZE = moderateScale(36);

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function hashStringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 70%)`;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  user,
  size = AVATAR_SIZE,
  theme,
  style,
  textStyle,
}) => {
  const avatarSize = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size / 2,
    }),
    [size],
  );

  const backgroundColor = useMemo(
    () => hashStringToColor(user._id),
    [user._id],
  );

  if (typeof user.avatar === "function") {
    return (
      <View style={[styles.container, avatarSize, style]}>{user.avatar()}</View>
    );
  }

  if (user.avatar && typeof user.avatar === "string") {
    return (
      <Image
        source={{ uri: user.avatar }}
        style={[styles.image, avatarSize, style]}
      />
    );
  }

  return (
    <View style={[styles.placeholder, avatarSize, { backgroundColor }, style]}>
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.4,
            color: theme.colors.avatarText,
            fontFamily: theme.fonts.bold,
          },
          textStyle,
        ]}
      >
        {getInitials(user.name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontWeight: "700",
  },
});

export const Avatar = memo(AvatarComponent);
