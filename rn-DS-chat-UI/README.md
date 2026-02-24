# react-native-ds-chat

A modern, customizable, and production-ready Chat UI library for React Native — built with TypeScript, functional components, and performance in mind.

## 📱 Preview

### Screenshot

<p align="center">
  <img src="https://raw.githubusercontent.com/GufranGaury1887/dsChat/main/screenshot/ChatScreen.png" alt="Chat Screen" width="300" />
</p>

### Demo Video

<p align="center">
  <img src="https://raw.githubusercontent.com/GufranGaury1887/dsChat/main/screenshot/chatVideo.gif" alt="Chat Demo" width="300" />
</p>

## Features

- Full chat UI with message bubbles, avatars, timestamps, and status indicators
- Optimized FlatList-based rendering with memoization
- Typing indicator with animated dots
- Day separators with smart date formatting (Today, Yesterday, weekday names)
- Load earlier messages (infinite scroll)
- Keyboard-aware layout with platform-specific handling
- Animated message appearance
- Complete theming system with light and dark themes
- Every component is customizable via render props
- Strict TypeScript types throughout
- Zero heavy external dependencies

## Installation

```bash
npm install react-native-ds-chat
# or
yarn add react-native-ds-chat
```

### Peer Dependencies

```bash
npm install react-native-safe-area-context
```

## Quick Start

```tsx
import React, { useState, useCallback } from "react";
import { Chat, Message } from "react-native-ds-chat";

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: "1",
      text: "Hello! Welcome to react-native-ds-chat",
      createdAt: new Date(),
      user: {
        _id: "2",
        name: "Bot",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      status: "read",
    },
  ]);

  const currentUser = { _id: "1", name: "You" };

  const onSend = useCallback((newMessages: Message[]) => {
    setMessages((prev) => [...newMessages, ...prev]);
  }, []);

  return (
    <Chat
      messages={messages}
      user={currentUser}
      onSend={onSend}
      placeholder="Type a message..."
      showReceiverAvatar
    />
  );
};
```

## Props

### `<Chat />` Props

| Prop                 | Type                            | Default               | Description                          |
| -------------------- | ------------------------------- | --------------------- | ------------------------------------ |
| `messages`           | `Message[]`                     | **required**          | Array of messages to display         |
| `user`               | `ChatUser`                      | **required**          | Current user object                  |
| `onSend`             | `(messages: Message[]) => void` | **required**          | Callback when sending a message      |
| `placeholder`        | `string`                        | `'Type a message...'` | Input placeholder text               |
| `isTyping`           | `boolean`                       | `false`               | Show typing indicator                |
| `typingUser`         | `ChatUser`                      | —                     | User who is typing                   |
| `showUserAvatar`     | `boolean`                       | `false`               | Show avatar for current user         |
| `showReceiverAvatar` | `boolean`                       | `true`                | Show avatar for other users          |
| `inverted`           | `boolean`                       | `true`                | Inverted FlatList (newest at bottom) |
| `alwaysShowSend`     | `boolean`                       | `false`               | Always show send button              |
| `maxInputLength`     | `number`                        | —                     | Max characters in input              |
| `animateMessages`    | `boolean`                       | `true`                | Animate new messages                 |
| `theme`              | `Partial<ChatTheme>`            | Light theme           | Theme overrides                      |
| `onLoadEarlier`      | `() => void`                    | —                     | Callback to load older messages      |
| `isLoadingEarlier`   | `boolean`                       | `false`               | Show loading spinner                 |
| `dateFormat`         | `string`                        | —                     | Custom date format                   |
| `timeFormat`         | `string`                        | —                     | `'24h'` for 24-hour time             |

### Custom Renderers

| Prop                  | Type                                       |
| --------------------- | ------------------------------------------ |
| `renderBubble`        | `(props: MessageBubbleProps) => ReactNode` |
| `renderMessage`       | `(props: MessageRowProps) => ReactNode`    |
| `renderAvatar`        | `(props: AvatarProps) => ReactNode`        |
| `renderInputToolbar`  | `(props: InputToolbarProps) => ReactNode`  |
| `renderSend`          | `(props: SendButtonProps) => ReactNode`    |
| `renderDay`           | `(props: DaySeparatorProps) => ReactNode`  |
| `renderSystemMessage` | `(props: SystemMessageProps) => ReactNode` |
| `renderFooter`        | `() => ReactNode`                          |
| `renderHeader`        | `() => ReactNode`                          |
| `renderEmpty`         | `() => ReactNode`                          |
| `renderAccessory`     | `() => ReactNode`                          |
| `renderMessageStatus` | `(status: MessageStatus) => ReactNode`     |

## Types

```typescript
interface Message {
  _id: string;
  text: string;
  createdAt: Date | number;
  user: ChatUser;
  image?: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  system?: boolean;
}

interface ChatUser {
  _id: string;
  name?: string;
  avatar?: string | (() => ReactNode);
}
```

## Theming

```tsx
import { Chat, DARK_THEME } from 'react-native-ds-chat';

// Use the built-in dark theme
<Chat theme={DARK_THEME} ... />

// Or customize
<Chat
  theme={{
    colors: {
      primary: '#FF6B6B',
      sentBubble: '#FF6B6B',
      background: '#1A1A2E',
    },
  }}
  ...
/>
```

## Individual Components

All components are exported and can be used standalone:

```tsx
import {
  MessageBubble,
  Avatar,
  InputToolbar,
  SendButton,
  TypingIndicator,
  DaySeparator,
} from "react-native-ds-chat";
```

## Utilities

```tsx
import {
  createMessage,
  formatTime,
  formatDayHeader,
  isSameDay,
  isToday,
} from "react-native-ds-chat";
```

## License

MIT
