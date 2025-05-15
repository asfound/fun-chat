import type { CurrentChat } from '../store/reducer';
import type {
  SendMessagePayload,
  ClientRequest,
  MessageDataPayload,
  FetchHistoryPayload,
  MessagesPayload,
  Message,
  ReadOrDeleteMessagePayload,
  ReadStatusChangePayload,
  DeleteNotificationPayload,
  EditMessagePayload,
  EditMessageNotificationPayload,
} from '../types/interfaces';
import type {
  AddMessageEvent,
  DeleteMessageEvent,
  EditMessageEvent,
} from '../types/message-events';

import { showModal } from '../components/modal/modal';
import { CLIENT_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import { emitChatMessageEvent, setCurrentChat } from '../store/actions';
import { assertErrorResponsePayload } from '../types/guards';
import { MESSAGE_EVENT_TYPE } from '../types/message-events';
import { getWebSocketClient } from './websocket/websocket-client';

export function sendMessage(to: string, text: string): Promise<void> {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: SendMessagePayload = {
    message: {
      to,
      text,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.MSG_SEND,
  };

  return client.sendRequest<MessageDataPayload>(request).then((response) => {
    const event: AddMessageEvent = {
      kind: MESSAGE_EVENT_TYPE.ADD_MESSAGE,
      message: response.message,
    };

    store.dispatch(emitChatMessageEvent(event));
  });
}

export function deleteMessage(messageId: string): void {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: ReadOrDeleteMessagePayload = {
    message: {
      id: messageId,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.MSG_DELETE,
  };

  client
    .sendRequest<DeleteNotificationPayload>(request)
    .then((response) => {
      const event: DeleteMessageEvent = {
        kind: MESSAGE_EVENT_TYPE.DELETE_MESSAGE,
        id: response.message.id,
        status: response.message.status,
      };

      store.dispatch(emitChatMessageEvent(event));
    })
    .catch((error: unknown) => {
      assertErrorResponsePayload(error);
      showModal(error.error);
    });
}

export function editMessage(messageId: string, text: string): void {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: EditMessagePayload = {
    message: {
      id: messageId,
      text,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.MSG_EDIT,
  };

  client
    .sendRequest<EditMessageNotificationPayload>(request)
    .then((response) => {
      const event: EditMessageEvent = {
        kind: MESSAGE_EVENT_TYPE.EDIT_MESSAGE,
        id: response.message.id,
        text: response.message.text,
        status: response.message.status,
      };

      store.dispatch(emitChatMessageEvent(event));
    })
    .catch((error: unknown) => {
      assertErrorResponsePayload(error);
      showModal(error.error);
    });
}

export function markMessageAsRead(messageId: string): void {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: ReadOrDeleteMessagePayload = {
    message: {
      id: messageId,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.MSG_READ,
  };

  client.sendRequest<ReadStatusChangePayload>(request).catch((error: unknown) => {
    assertErrorResponsePayload(error);
    showModal(error.error);
  });
}

export function fetchChatMessageHistory(userLogin: string): void {
  fetchMessageHistory(userLogin)
    .then((messages) => {
      const payload = createCurrentChatState(userLogin, messages);
      store.dispatch(setCurrentChat(payload));
    })
    .catch((error: unknown) => {
      assertErrorResponsePayload(error);
      showModal(error.error);
    });
}

export function fetchMessageHistory(userLogin: string): Promise<Message[]> {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: FetchHistoryPayload = {
    user: {
      login: userLogin,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.MSG_FROM_USER,
  };

  return client.sendRequest<MessagesPayload>(request).then((response) => response.messages);
}

function createCurrentChatState(userLogin: string, messages: Message[]): CurrentChat {
  const messagesMap = new Map(messages.map((message) => [message.id, message]));

  return {
    userLogin,

    messageHistory: messages,
    messages: messagesMap,
    updatesQueue: [],
  };
}
