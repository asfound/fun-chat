import type { Message, MessageStatus } from './interfaces';

export const MESSAGE_EVENT_TYPE = {
  ADD_MESSAGE: 'addMessage',
  DELIVERY_UPDATE: 'deliveryUpdate',
  READ_UPDATE: 'readUpdate',
} as const;

export type MessageEventType =
  (typeof MESSAGE_EVENT_TYPE)[keyof typeof MESSAGE_EVENT_TYPE];

export interface AddMessageEvent {
  kind: typeof MESSAGE_EVENT_TYPE.ADD_MESSAGE;

  message: Message;
}

export interface DeliveryUpdateEvent {
  kind: typeof MESSAGE_EVENT_TYPE.DELIVERY_UPDATE;

  id: string;
  status: Pick<MessageStatus, 'isDelivered'>;
}

export interface ReadUpdateEvent {
  kind: typeof MESSAGE_EVENT_TYPE.READ_UPDATE;

  id: string;
  status: Pick<MessageStatus, 'isReaded'>;
}

export type ChatMessageEvent =
  | AddMessageEvent
  | DeliveryUpdateEvent
  | ReadUpdateEvent;
