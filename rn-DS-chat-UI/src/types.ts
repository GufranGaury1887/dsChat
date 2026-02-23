import type { ReactNode } from "react";
import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  FlatListProps,
  TextInputProps,
} from "react-native";

// ─── Core Data Types ───────────────────────────────────────────────

export interface ChatUser {
  _id: string | number;
  name?: string;
  avatar?: string | (() => ReactNode);
}

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface Message {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: ChatUser;
  image?: string;
  status?: MessageStatus;
  system?: boolean;
  pending?: boolean;
}

// ─── Theme ─────────────────────────────────────────────────────────

export interface ChatTheme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    sentBubble: string;
    sentBubbleText: string;
    receivedBubble: string;
    receivedBubbleText: string;
    inputBackground: string;
    inputText: string;
    inputPlaceholder: string;
    border: string;
    timestamp: string;
    systemMessage: string;
    sendButton: string;
    sendButtonDisabled: string;
    avatarBackground: string;
    avatarText: string;
    typingIndicator: string;
    daySeparator: string;
    daySeparatorText: string;
    statusSent: string;
    statusDelivered: string;
    statusRead: string;
  };
  fonts: {
    regular: string | undefined;
    medium: string | undefined;
    bold: string | undefined;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    bubble: number;
    input: number;
    avatar: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
}

// ─── Component Props ───────────────────────────────────────────────

export interface ChatProps {
  messages: Message[];
  user: ChatUser;
  onSend: (messages: Message[]) => void;

  // Load earlier
  onLoadEarlier?: () => void;
  isLoadingEarlier?: boolean;
  loadEarlierLabel?: string;

  // Typing
  isTyping?: boolean;
  typingUser?: ChatUser;

  // Customization
  placeholder?: string;
  alwaysShowSend?: boolean;
  maxInputLength?: number;
  textInputProps?: Partial<TextInputProps>;
  showUserAvatar?: boolean;
  showReceiverAvatar?: boolean;
  inverted?: boolean;
  dateFormat?: string;
  timeFormat?: string;

  // Theme
  theme?: Partial<ChatTheme>;

  // Custom renderers
  renderBubble?: (props: MessageBubbleProps) => ReactNode;
  renderMessage?: (props: MessageRowProps) => ReactNode;
  renderAvatar?: (props: AvatarProps) => ReactNode;
  renderInputToolbar?: (props: InputToolbarProps) => ReactNode;
  renderSend?: (props: SendButtonProps) => ReactNode;
  renderDay?: (props: DaySeparatorProps) => ReactNode;
  renderSystemMessage?: (props: SystemMessageProps) => ReactNode;
  renderFooter?: () => ReactNode;
  renderHeader?: () => ReactNode;
  renderEmpty?: () => ReactNode;
  renderAccessory?: () => ReactNode;
  renderMessageStatus?: (status: MessageStatus) => ReactNode;

  // Styles
  containerStyle?: StyleProp<ViewStyle>;
  messageContainerStyle?: StyleProp<ViewStyle>;
  listViewProps?: Partial<FlatListProps<Message>>;

  // Keyboard
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
  keyboardVerticalOffset?: number;

  // Animations
  animateMessages?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  theme: ChatTheme;
  renderMessageStatus?: (status: MessageStatus) => ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  timeStyle?: StyleProp<TextStyle>;
  timeFormat?: string;
}

export interface MessageRowProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  theme: ChatTheme;
  renderBubble?: (props: MessageBubbleProps) => ReactNode;
  renderAvatar?: (props: AvatarProps) => ReactNode;
  renderMessageStatus?: (status: MessageStatus) => ReactNode;
  animateMessages?: boolean;
  timeFormat?: string;
}

export interface AvatarProps {
  user: ChatUser;
  size?: number;
  theme: ChatTheme;
  style?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface InputToolbarProps {
  text: string;
  onTextChanged: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  alwaysShowSend?: boolean;
  maxInputLength?: number;
  textInputProps?: Partial<TextInputProps>;
  theme: ChatTheme;
  renderSend?: (props: SendButtonProps) => ReactNode;
  renderAccessory?: () => ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export interface SendButtonProps {
  disabled: boolean;
  onSend: () => void;
  theme: ChatTheme;
  style?: StyleProp<ViewStyle>;
}

export interface TypingIndicatorProps {
  isTyping: boolean;
  typingUser?: ChatUser;
  theme: ChatTheme;
  style?: StyleProp<ViewStyle>;
}

export interface DaySeparatorProps {
  date: Date;
  theme: ChatTheme;
  dateFormat?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface SystemMessageProps {
  message: Message;
  theme: ChatTheme;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface MessageListProps {
  messages: Message[];
  user: ChatUser;
  inverted: boolean;
  theme: ChatTheme;
  showUserAvatar: boolean;
  showReceiverAvatar: boolean;
  animateMessages: boolean;
  dateFormat?: string;
  timeFormat?: string;

  onLoadEarlier?: () => void;
  isLoadingEarlier?: boolean;
  loadEarlierLabel?: string;

  renderBubble?: (props: MessageBubbleProps) => ReactNode;
  renderMessage?: (props: MessageRowProps) => ReactNode;
  renderAvatar?: (props: AvatarProps) => ReactNode;
  renderDay?: (props: DaySeparatorProps) => ReactNode;
  renderSystemMessage?: (props: SystemMessageProps) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderMessageStatus?: (status: MessageStatus) => ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
  listViewProps?: Partial<FlatListProps<Message>>;
}
