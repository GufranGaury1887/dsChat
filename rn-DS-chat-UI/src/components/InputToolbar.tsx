import React, { memo, useCallback, useRef } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import type { InputToolbarProps } from "../types";
import { SendButton } from "./SendButton";
import { moderateScale } from "../utils/scaling";

const InputToolbarComponent: React.FC<InputToolbarProps> = ({
  text,
  onTextChanged,
  onSend,
  placeholder = "Type a message...",
  alwaysShowSend = false,
  maxInputLength,
  textInputProps,
  theme,
  renderSend,
  renderAccessory,
  containerStyle,
  inputStyle,
}) => {
  const inputRef = useRef<TextInput>(null);

  const isSendDisabled = text.trim().length === 0;
  const showSend = alwaysShowSend || text.trim().length > 0;

  const handleSend = useCallback(() => {
    if (text.trim().length === 0) return;
    onSend();
    inputRef.current?.clear();
  }, [text, onSend]);

  const sendButtonProps = {
    disabled: isSendDisabled,
    onSend: handleSend,
    theme,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        containerStyle,
      ]}
    >
      {renderAccessory?.()}

      <View style={styles.inputRow}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.inputBackground,
              borderRadius: theme.borderRadius.input,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                color: theme.colors.inputText,
                fontSize: theme.fontSize.md,
                fontFamily: theme.fonts.regular,
              },
              inputStyle,
            ]}
            value={text}
            onChangeText={onTextChanged}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.inputPlaceholder}
            multiline
            maxLength={maxInputLength}
            textAlignVertical="center"
            returnKeyType="default"
            enablesReturnKeyAutomatically
            accessibilityLabel="Message input"
            {...textInputProps}
          />
        </View>

        {showSend && (
          <View style={styles.sendContainer}>
            {renderSend ? (
              renderSend(sendButtonProps)
            ) : (
              <SendButton {...sendButtonProps} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(8),
    paddingBottom: Platform.OS === "ios" ? moderateScale(8) : moderateScale(8),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: moderateScale(8),
  },
  inputContainer: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(120),
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === "ios" ? moderateScale(10) : moderateScale(8),
    paddingBottom: Platform.OS === "ios" ? moderateScale(10) : moderateScale(8),
    lineHeight: moderateScale(20),
    maxHeight: moderateScale(120),
  },
  sendContainer: {
    marginBottom: 0,
    justifyContent: "flex-end",
  },
});

export const InputToolbar = memo(InputToolbarComponent);
