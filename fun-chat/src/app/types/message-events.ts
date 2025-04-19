import type { Message } from './interfaces';

export const MESSAGE_EVENT_TYPE = {
  ADD_MESSAGE: 'addMessage',
  DELIVERY_UPDATE: 'deliveryUpdate',
} as const;

export type MessageEventType =
  (typeof MESSAGE_EVENT_TYPE)[keyof typeof MESSAGE_EVENT_TYPE];

export interface AddMessageEvent {
  kind: typeof MESSAGE_EVENT_TYPE.ADD_MESSAGE;

  message: Message;
}

export interface DeliveryUpdateEvent {
  kind: typeof MESSAGE_EVENT_TYPE.DELIVERY_UPDATE;

  status: {
    isDelivered: boolean;
  };
}

export type ChatMessageEvent = AddMessageEvent | DeliveryUpdateEvent;
