import type { Message, ChatUser } from '../types';
import { isSameDay } from './dateUtils';

let messageIdCounter = 0;

export function generateMessageId(): string {
  messageIdCounter += 1;
  return `msg_${Date.now()}_${messageIdCounter}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createMessage(
  text: string,
  user: ChatUser,
  overrides?: Partial<Message>,
): Message {
  return {
    _id: generateMessageId(),
    text,
    createdAt: new Date(),
    user,
    status: 'sending',
    ...overrides,
  };
}

export function isCurrentUser(message: Message, user: ChatUser): boolean {
  return message.user._id === user._id;
}

export function shouldShowDaySeparator(
  message: Message,
  previousMessage: Message | undefined,
): boolean {
  if (!previousMessage) return true;
  return !isSameDay(message.createdAt, previousMessage.createdAt);
}

export function shouldShowAvatar(
  message: Message,
  nextMessage: Message | undefined,
): boolean {
  if (!nextMessage) return true;
  return message.user._id !== nextMessage.user._id;
}

export function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();

  for (const message of messages) {
    const date = message.createdAt instanceof Date
      ? message.createdAt
      : new Date(message.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const existing = groups.get(key);
    if (existing) {
      existing.push(message);
    } else {
      groups.set(key, [message]);
    }
  }

  return groups;
}
