// Components
export { Chat } from "./components/Chat";
export { MessageList } from "./components/MessageList";
export { MessageBubble } from "./components/MessageBubble";
export { MessageRow } from "./components/MessageRow";
export { Avatar } from "./components/Avatar";
export { InputToolbar } from "./components/InputToolbar";
export { SendButton } from "./components/SendButton";
export { TypingIndicator } from "./components/TypingIndicator";
export { DaySeparator } from "./components/DaySeparator";
export { SystemMessage } from "./components/SystemMessage";
export { LoadEarlier } from "./components/LoadEarlier";

// Theme
export { DEFAULT_THEME, DARK_THEME, mergeTheme } from "./theme";

// Utils
export {
  isSameDay,
  isToday,
  isYesterday,
  formatTime,
  formatDayHeader,
  generateMessageId,
  createMessage,
  isCurrentUser,
  shouldShowDaySeparator,
  shouldShowAvatar,
  groupMessagesByDate,
} from "./utils";

// Scaling
export { moderateScale, scale, verticalScale } from "./utils/scaling";

// Hooks
export { useKeyboardHeight } from "./hooks/useKeyboardHeight";
export { useAnimatedMessage } from "./hooks/useAnimatedMessage";

// Types
export type {
  ChatUser,
  Message,
  MessageStatus,
  ChatTheme,
  ChatProps,
  MessageBubbleProps,
  MessageRowProps,
  AvatarProps,
  InputToolbarProps,
  SendButtonProps,
  TypingIndicatorProps,
  DaySeparatorProps,
  SystemMessageProps,
  MessageListProps,
} from "./types";
