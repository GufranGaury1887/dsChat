import React, { memo, useCallback, useRef, useMemo } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import type { Message, MessageListProps } from "../types";
import { MessageRow } from "./MessageRow";
import { DaySeparator } from "./DaySeparator";
import { SystemMessage } from "./SystemMessage";
import { LoadEarlier } from "./LoadEarlier";
import {
  shouldShowDaySeparator,
  shouldShowAvatar,
  isCurrentUser,
} from "../utils/messageUtils";
import { moderateScale } from "../utils/scaling";

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  user,
  inverted,
  theme,
  showUserAvatar,
  showReceiverAvatar,
  animateMessages,
  dateFormat,
  timeFormat,
  onLoadEarlier,
  isLoadingEarlier = false,
  loadEarlierLabel = "Load earlier messages",
  renderBubble,
  renderMessage,
  renderAvatar,
  renderDay,
  renderSystemMessage,
  renderEmpty,
  renderMessageStatus,
  containerStyle,
  listViewProps,
}) => {
  const flatListRef = useRef<FlatList<Message>>(null);

  const keyExtractor = useCallback((item: Message) => String(item._id), []);

  const getAdjacentMessage = useCallback(
    (index: number): Message | undefined => {
      if (inverted) {
        return messages[index + 1];
      }
      return messages[index - 1];
    },
    [messages, inverted],
  );

  const getNextMessage = useCallback(
    (index: number): Message | undefined => {
      if (inverted) {
        return messages[index - 1];
      }
      return messages[index + 1];
    },
    [messages, inverted],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Message>) => {
      const message = item;
      const isCurrent = isCurrentUser(message, user);
      const previousMessage = getAdjacentMessage(index);
      const nextMessage = getNextMessage(index);

      const showDay = shouldShowDaySeparator(message, previousMessage);
      const showAvatarForMsg = shouldShowAvatar(message, nextMessage);
      const shouldShowAvatarFinal = isCurrent
        ? showUserAvatar
        : showReceiverAvatar;

      if (message.system) {
        const systemProps = { message, theme };
        return (
          <View>
            {showDay &&
              (renderDay ? (
                renderDay({
                  date: new Date(message.createdAt),
                  theme,
                  dateFormat,
                })
              ) : (
                <DaySeparator
                  date={new Date(message.createdAt)}
                  theme={theme}
                  dateFormat={dateFormat}
                />
              ))}
            {renderSystemMessage ? (
              renderSystemMessage(systemProps)
            ) : (
              <SystemMessage {...systemProps} />
            )}
          </View>
        );
      }

      const rowProps = {
        message,
        isCurrentUser: isCurrent,
        showAvatar: shouldShowAvatarFinal && showAvatarForMsg,
        theme,
        renderBubble,
        renderAvatar,
        renderMessageStatus,
        animateMessages,
        timeFormat,
      };

      return (
        <View>
          {showDay &&
            (renderDay ? (
              renderDay({
                date: new Date(message.createdAt),
                theme,
                dateFormat,
              })
            ) : (
              <DaySeparator
                date={new Date(message.createdAt)}
                theme={theme}
                dateFormat={dateFormat}
              />
            ))}
          {renderMessage ? (
            renderMessage(rowProps)
          ) : (
            <MessageRow {...rowProps} />
          )}
        </View>
      );
    },
    [
      user,
      theme,
      showUserAvatar,
      showReceiverAvatar,
      animateMessages,
      dateFormat,
      timeFormat,
      renderBubble,
      renderMessage,
      renderAvatar,
      renderDay,
      renderSystemMessage,
      renderMessageStatus,
      getAdjacentMessage,
      getNextMessage,
    ],
  );

  const ListEmptyComponent = useMemo(() => {
    if (renderEmpty) return <>{renderEmpty()}</>;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.systemMessage }]}>
          No messages yet
        </Text>
        <Text
          style={[styles.emptySubtext, { color: theme.colors.systemMessage }]}
        >
          Send a message to start the conversation
        </Text>
      </View>
    );
  }, [renderEmpty, theme]);

  const ListHeaderComponent = useMemo(() => {
    if (!onLoadEarlier) return null;

    return (
      <LoadEarlier
        onLoadEarlier={onLoadEarlier}
        isLoading={isLoadingEarlier}
        label={loadEarlierLabel}
        theme={theme}
      />
    );
  }, [onLoadEarlier, isLoadingEarlier, loadEarlierLabel, theme]);

  return (
    <FlatList<Message>
      ref={flatListRef}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      inverted={inverted}
      style={[styles.list, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        messages.length === 0 && styles.emptyContentContainer,
        containerStyle,
      ]}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={inverted ? ListHeaderComponent : undefined}
      ListHeaderComponent={inverted ? undefined : ListHeaderComponent}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={false}
      maxToRenderPerBatch={15}
      windowSize={21}
      initialNumToRender={20}
      maintainVisibleContentPosition={
        !inverted ? { minIndexForVisible: 0 } : undefined
      }
      {...listViewProps}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(16),
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(40),
    paddingHorizontal: moderateScale(24),
    transform: [{ scaleY: -1 }],
  },
  emptyText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: moderateScale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
});

export const MessageList = memo(MessageListComponent);
