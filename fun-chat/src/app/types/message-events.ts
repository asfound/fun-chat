import type { Message, MessageStatus } from './interfaces';

export const MESSAGE_EVENT_TYPE = {
  ADD_MESSAGE: 'addMessage',
  DELETE_MESSAGE: 'deleteMessage',
  EDIT_MESSAGE: 'editMessage',

  DELIVERY_UPDATE: 'deliveryUpdate',
  READ_UPDATE: 'readUpdate',
} as const;

export type MessageEventType = (typeof MESSAGE_EVENT_TYPE)[keyof typeof MESSAGE_EVENT_TYPE];

export interface AddMessageEvent {
  kind: typeof MESSAGE_EVENT_TYPE.ADD_MESSAGE;

  message: Message;
}

// TODO Add data type to use here and in payload {id: ..., status: ...}
export interface DeleteMessageEvent {
  kind: typeof MESSAGE_EVENT_TYPE.DELETE_MESSAGE;

  id: string;
  status: {
    isDeleted: boolean;
  };
}

export interface EditMessageEvent {
  kind: typeof MESSAGE_EVENT_TYPE.EDIT_MESSAGE;

  id: string;
  text: string;
  status: Pick<MessageStatus, 'isEdited'>;
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
  | DeleteMessageEvent
  | EditMessageEvent
  | DeliveryUpdateEvent
  | ReadUpdateEvent;
