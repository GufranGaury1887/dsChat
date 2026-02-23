# 💬 dsChat

A modern, production-ready **React Native chat application** powered by [`rn-DS-chat-UI`](./rn-DS-chat-UI) — a fully customizable, TypeScript-first chat UI library built from the ground up.

---

## ✨ Features

### App

- Real-time chat interface with smooth message animations
- Custom message bubbles with gradient highlights and shadows
- Custom input toolbar with attachment button and animated send button
- Message status indicators (sending, sent, delivered, read, failed)
- Image attachment support
- Safe area handling for modern devices

### Library (`rn-DS-chat-UI`)

- Full chat UI with message bubbles, avatars, timestamps & status indicators
- Optimized `FlatList`-based rendering with memoization
- Typing indicator with animated dots
- Day separators with smart date formatting (Today, Yesterday, weekday names)
- Load earlier messages (infinite scroll)
- Keyboard-aware layout with platform-specific handling
- Complete theming system with light & dark themes
- Every component is customizable via render props
- Strict TypeScript types throughout
- Zero heavy external dependencies

---

## 🛠 Tech Stack

| Layer               | Technology                                                                        |
| ------------------- | --------------------------------------------------------------------------------- |
| **Framework**       | [React Native](https://reactnative.dev/) `0.81.5`                                 |
| **Platform**        | [Expo](https://expo.dev/) SDK `54`                                                |
| **Language**        | TypeScript `5.9`                                                                  |
| **React**           | React `19.1`                                                                      |
| **Architecture**    | New Architecture enabled                                                          |
| **Chat UI Library** | `rn-DS-chat-UI` (local package)                                                   |
| **Build Tool**      | [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob) |

---

## 📁 Project Structure

```
dsChat/
├── App.js                      # Default Expo entry (not used as root)
├── index.js                    # App entry point — registers ChatScreen
├── app.json                    # Expo configuration
├── package.json                # Root dependencies & scripts
├── tsconfig.json               # TypeScript configuration
│
├── src/
│   └── Screens/
│       └── ChatScreen.tsx      # Main chat screen with custom components
│
├── rn-DS-chat-UI/              # Chat UI library (local package)
│   ├── src/
│   │   ├── index.ts            # Library entry point & exports
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── theme.ts            # Light/Dark theme system
│   │   ├── components/
│   │   │   ├── Chat.tsx            # Main Chat orchestrator
│   │   │   ├── MessageList.tsx     # Virtualized message list
│   │   │   ├── MessageRow.tsx      # Individual message row layout
│   │   │   ├── MessageBubble.tsx   # Message bubble component
│   │   │   ├── InputToolbar.tsx    # Input toolbar with send button
│   │   │   ├── SendButton.tsx      # Animated send button
│   │   │   ├── Avatar.tsx          # User avatar component
│   │   │   ├── DaySeparator.tsx    # Day header separator
│   │   │   ├── TypingIndicator.tsx # Animated typing dots
│   │   │   ├── LoadEarlier.tsx     # Load more messages button
│   │   │   └── SystemMessage.tsx   # System message display
│   │   ├── hooks/
│   │   │   ├── useAnimatedMessage.ts
│   │   │   └── useKeyboardHeight.ts
│   │   └── utils/
│   │       ├── dateUtils.ts        # Date formatting helpers
│   │       ├── messageUtils.ts     # Message creation helpers
│   │       ├── scaling.ts          # Responsive scaling utilities
│   │       └── index.ts
│   ├── package.json
│   └── README.md               # Library-specific documentation
│
├── assets/                     # App icons, splash screens
├── android/                    # Android native project
└── ios/                        # iOS native project
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **Expo CLI** (`npx expo`)
- **Xcode** (for iOS) / **Android Studio** (for Android)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dsChat
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS pods** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

---

## 🎨 Customization

### Custom Message Bubble

The app ships with a custom `CustomMessageBubble` component featuring:

- Distinct sent/received bubble shapes with asymmetric border radii
- Subtle gradient highlight overlay on sent bubbles
- Platform-specific shadow effects (iOS shadow / Android elevation)
- Status icon indicators (✓, ✓✓, ⚠)

```tsx
<Chat
  renderBubble={(props) => <CustomMessageBubble {...props} />}
  ...
/>
```

### Custom Input Toolbar

A custom `CustomInputToolbar` component is included with:

- Attachment (plus) button
- Auto-expanding multiline input field
- Animated send button with spring press feedback
- Send button appears only when text is entered

```tsx
<Chat
  renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
  ...
/>
```

### Theming

The library supports complete theming with built-in light and dark themes:

```tsx
import { Chat, DARK_THEME } from 'rn-ds-chat-ui';

// Built-in dark theme
<Chat theme={DARK_THEME} ... />

// Custom theme overrides
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

---

## 📦 Library Usage

The `rn-DS-chat-UI` library is a standalone npm package located in the `rn-DS-chat-UI/` directory. It can be published to npm independently.

### Quick Start

```tsx
import { Chat, Message } from "rn-ds-chat-ui";

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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

### Available Components

All components are individually exported and can be used standalone:

```tsx
import {
  MessageBubble,
  Avatar,
  InputToolbar,
  SendButton,
  TypingIndicator,
  DaySeparator,
} from "rn-ds-chat-ui";
```

### Utility Functions

```tsx
import {
  createMessage,
  formatTime,
  formatDayHeader,
  isSameDay,
  isToday,
  moderateScale,
} from "rn-ds-chat-ui";
```

> 📖 For complete library documentation, see [`rn-DS-chat-UI/README.md`](./rn-DS-chat-UI/README.md)

---

## 📜 Scripts

| Script            | Description             |
| ----------------- | ----------------------- |
| `npm start`       | Start Expo dev server   |
| `npm run ios`     | Run on iOS simulator    |
| `npm run android` | Run on Android emulator |
| `npm run web`     | Start web version       |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
