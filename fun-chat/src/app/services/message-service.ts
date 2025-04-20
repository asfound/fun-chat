import type { CurrentChat } from '../store/reducer';
import type {
  SendMessagePayload,
  ClientRequest,
  MessageDataPayload,
  FetchHistoryPayload,
  MessagesPayload,
  Message,
} from '../types/interfaces';
import type { AddMessageEvent } from '../types/message-events';

import { CLIENT_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import { emitChatMessageEvent, setCurrentChat } from '../store/actions';
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
    console.log(response);
  });
}

export function fetchMessageHistory(userLogin: string): void {
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

  client
    .sendRequest<MessagesPayload>(request)
    .then((response) => {
      const payload = createCurrentChatState(userLogin, response.messages);
      store.dispatch(setCurrentChat(payload));
    })
    .catch((error: unknown) => {
      console.log(error);
    });
}

function createCurrentChatState(
  userLogin: string,
  messages: Message[]
): CurrentChat {
  const messagesMap = new Map(messages.map((message) => [message.id, message]));

  return {
    userLogin,
    messageHistory: messages,
    messages: messagesMap,
    updatesQueue: [],
  };
}
