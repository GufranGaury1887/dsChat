import type { ChatTheme } from "./types";
import { moderateScale } from "./utils/scaling";

export const DEFAULT_THEME: ChatTheme = {
  colors: {
    primary: "#6C63FF",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    sentBubble: "#6C63FF",
    sentBubbleText: "#FFFFFF",
    receivedBubble: "#F0F0F5",
    receivedBubbleText: "#1A1A2E",
    inputBackground: "#F5F5F8",
    inputText: "#1A1A2E",
    inputPlaceholder: "#9E9EB8",
    border: "#E8E8EF",
    timestamp: "#9E9EB8",
    systemMessage: "#9E9EB8",
    sendButton: "#6C63FF",
    sendButtonDisabled: "#C4C4D4",
    avatarBackground: "#E8E5FF",
    avatarText: "#6C63FF",
    typingIndicator: "#9E9EB8",
    daySeparator: "#E8E8EF",
    daySeparatorText: "#9E9EB8",
    statusSent: "#9E9EB8",
    statusDelivered: "#6C63FF",
    statusRead: "#34C759",
  },
  fonts: {
    regular: undefined,
    medium: undefined,
    bold: undefined,
  },
  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(24),
  },
  borderRadius: {
    bubble: moderateScale(18),
    input: moderateScale(24),
    avatar: moderateScale(20),
  },
  fontSize: {
    xs: moderateScale(10),
    sm: moderateScale(12),
    md: moderateScale(15),
    lg: moderateScale(17),
  },
};

export const DARK_THEME: ChatTheme = {
  ...DEFAULT_THEME,
  colors: {
    primary: "#7B73FF",
    background: "#0F0C29",
    surface: "#1A1735",
    sentBubble: "#5B4FCF",
    sentBubbleText: "#FFFFFF",
    receivedBubble: "#1E1B38",
    receivedBubbleText: "#E0DFF0",
    inputBackground: "#1A1735",
    inputText: "#E8E8F0",
    inputPlaceholder: "#6E6B8A",
    border: "#2A2748",
    timestamp: "#6E6B8A",
    systemMessage: "#6E6B8A",
    sendButton: "#7B73FF",
    sendButtonDisabled: "#3D3A5C",
    avatarBackground: "#302B63",
    avatarText: "#7B73FF",
    typingIndicator: "#6E6B8A",
    daySeparator: "#2A2748",
    daySeparatorText: "#6E6B8A",
    statusSent: "#6E6B8A",
    statusDelivered: "#9B93FF",
    statusRead: "#30D158",
  },
};

export function mergeTheme(
  base: ChatTheme,
  overrides?: Partial<ChatTheme>,
): ChatTheme {
  if (!overrides) return base;

  return {
    colors: { ...base.colors, ...overrides.colors },
    fonts: { ...base.fonts, ...overrides.fonts },
    spacing: { ...base.spacing, ...overrides.spacing },
    borderRadius: { ...base.borderRadius, ...overrides.borderRadius },
    fontSize: { ...base.fontSize, ...overrides.fontSize },
  };
}
