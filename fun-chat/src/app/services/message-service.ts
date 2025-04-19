import type { CurrentChat } from '../store/reducer';
import type {
  SendMessagePayload,
  ClientRequest,
  MessageDataPayload,
  FetchHistoryPayload,
  MessagesPayload,
} from '../types/interfaces';

import { CLIENT_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import { setCurrentChat } from '../store/actions';
import { getWebSocketClient } from './websocket/websocket-client';

export function sendMessage(to: string, text: string): void {
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

  client
    .sendRequest<MessageDataPayload>(request)
    .then((response) => {
      console.log(response);
    })
    .catch((error: unknown) => {
      console.log(error);
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
      const payload: CurrentChat = {
        userLogin,
        messages: response.messages,
      };
      store.dispatch(setCurrentChat(payload));
    })
    .catch((error: unknown) => {
      console.log(error);
    });
}
