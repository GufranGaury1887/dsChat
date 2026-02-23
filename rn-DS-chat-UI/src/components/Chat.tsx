import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import type { ChatProps } from "../types";
import { DEFAULT_THEME, mergeTheme } from "../theme";
import { createMessage } from "../utils/messageUtils";
import { MessageList } from "./MessageList";
import { InputToolbar } from "./InputToolbar";
import { TypingIndicator } from "./TypingIndicator";

const ChatInner: React.FC<ChatProps> = ({
  messages,
  user,
  onSend,

  onLoadEarlier,
  isLoadingEarlier,
  loadEarlierLabel,

  isTyping = false,
  typingUser,

  placeholder,
  alwaysShowSend,
  maxInputLength,
  textInputProps,
  showUserAvatar = false,
  showReceiverAvatar = true,
  inverted = true,
  dateFormat,
  timeFormat,

  theme: themeOverrides,

  renderBubble,
  renderMessage,
  renderAvatar,
  renderInputToolbar,
  renderSend,
  renderDay,
  renderSystemMessage,
  renderFooter,
  renderHeader,
  renderEmpty,
  renderAccessory,
  renderMessageStatus,

  containerStyle,
  messageContainerStyle,
  listViewProps,

  keyboardShouldPersistTaps,

  animateMessages = true,

  keyboardVerticalOffset: keyboardVerticalOffsetProp,
}) => {
  const [inputText, setInputText] = useState("");
  const theme = useMemo(
    () => mergeTheme(DEFAULT_THEME, themeOverrides),
    [themeOverrides],
  );
  const containerRef = useRef<View>(null);
  const [measuredOffset, setMeasuredOffset] = useState<number | null>(null);

  let insets = { top: 0, bottom: 0, left: 0, right: 0 };
  try {
    insets = useSafeAreaInsets();
  } catch {
    // Safe area context not available — use fallback
  }

  // Measure the container's position on screen to compute the correct offset
  const handleLayout = useCallback(() => {
    if (Platform.OS !== "ios") return;
    containerRef.current?.measureInWindow((_x, y) => {
      if (typeof y === "number" && y > 0) {
        setMeasuredOffset(y);
      }
    });
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage = createMessage(trimmed, user);
    onSend([newMessage]);
    setInputText("");
  }, [inputText, user, onSend]);

  const inputToolbarProps = useMemo(
    () => ({
      text: inputText,
      onTextChanged: setInputText,
      onSend: handleSend,
      placeholder,
      alwaysShowSend,
      maxInputLength,
      textInputProps,
      theme,
      renderSend,
      renderAccessory,
    }),
    [
      inputText,
      handleSend,
      placeholder,
      alwaysShowSend,
      maxInputLength,
      textInputProps,
      theme,
      renderSend,
      renderAccessory,
    ],
  );

  const keyboardBehavior =
    Platform.OS === "ios" ? ("padding" as const) : undefined;

  // Determine the correct keyboardVerticalOffset:
  // 1. If the consumer passed an explicit value, use it
  // 2. If we measured the container's Y position on screen, use that
  // 3. Fallback to insets.top (works when Chat is at the root level)
  const keyboardOffset =
    Platform.OS === "ios"
      ? (keyboardVerticalOffsetProp ?? measuredOffset ?? insets.top)
      : 0;

  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        containerStyle,
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        {renderHeader?.()}

        <MessageList
          messages={messages}
          user={user}
          inverted={inverted}
          theme={theme}
          showUserAvatar={showUserAvatar}
          showReceiverAvatar={showReceiverAvatar}
          animateMessages={animateMessages}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          onLoadEarlier={onLoadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          loadEarlierLabel={loadEarlierLabel}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          renderAvatar={renderAvatar}
          renderDay={renderDay}
          renderSystemMessage={renderSystemMessage}
          renderEmpty={renderEmpty}
          renderMessageStatus={renderMessageStatus}
          containerStyle={messageContainerStyle}
          listViewProps={{
            keyboardShouldPersistTaps: keyboardShouldPersistTaps ?? "handled",
            ...listViewProps,
          }}
        />

        <TypingIndicator
          isTyping={isTyping}
          typingUser={typingUser}
          theme={theme}
        />

        {renderInputToolbar ? (
          renderInputToolbar(inputToolbarProps)
        ) : (
          <InputToolbar {...inputToolbarProps} />
        )}

        {renderFooter?.()}

        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
});

export const Chat: React.FC<ChatProps> = (props) => {
  return (
    <SafeAreaProvider>
      <ChatInner {...props} />
    </SafeAreaProvider>
  );
};
