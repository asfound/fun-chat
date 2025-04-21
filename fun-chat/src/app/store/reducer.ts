import type { CurrentUser, Message, User } from '~/app/types/interfaces';

import type { AllActions, ChatMessageEventEmission } from './actions';

import { loadStateFromSessionStorage } from '../services/session-storage/session-storage';
import {
  MESSAGE_EVENT_TYPE,
  type ChatMessageEvent,
} from '../types/message-events';
import { ACTION } from './actions';

export type StoreReducer<S> = (state: S, action: AllActions) => S;

export interface State {
  isWebsocketOpen: boolean;

  currentUser: CurrentUser | null;
  currentChat: CurrentChat | null;

  users: Map<string, User>;

  searchValue: string;
}

export interface CurrentChat {
  userLogin: string;

  messageHistory: Message[];
  messages: Map<string, Message>;
  updatesQueue: ChatMessageEvent[];
}

export type StoredState = Omit<
  State,
  'isWebsocketOpen' | 'users' | 'currentChat'
>;

export const defaultState: State = {
  isWebsocketOpen: false,

  currentUser: null,
  currentChat: null,
  users: new Map(),

  searchValue: '',
};

export const initialState: State =
  loadStateFromSessionStorage() ?? defaultState;

export const createReducer: StoreReducer<State> = (
  state: State,
  action: AllActions
) => {
  switch (action.type) {
    case ACTION.SET_SOCKET_STATE: {
      return {
        ...state,
        isWebsocketOpen: action.payload,
      };
    }

    case ACTION.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }

    case ACTION.SET_USERS: {
      const usersMap = new Map(
        action.payload.map((user) => [user.login, user])
      );
      return {
        ...state,
        users: usersMap,
      };
    }

    case ACTION.SET_SEARCH_VALUE: {
      return {
        ...state,
        searchValue: action.payload,
      };
    }

    case ACTION.UPDATE_USER_STATUS: {
      const users: Map<string, User> = structuredClone(state.users);
      const user = action.payload;

      users.set(user.login, user);
      return {
        ...state,
        users,
      };
    }

    case ACTION.SET_CURRENT_CHAT: {
      return {
        ...state,
        currentChat: action.payload,
      };
    }

    case ACTION.EMIT_CHAT_MESSAGE_EVENT: {
      if (state.currentChat) {
        const updatedCurrentChat = handleEmitChatMessageEvent(
          action,
          state.currentChat
        );
        return {
          ...state,
          currentChat: updatedCurrentChat,
        };
      }

      return state;
    }

    default: {
      return state;
    }
  }
};

function handleEmitChatMessageEvent(
  event: ChatMessageEventEmission,
  currentChat: CurrentChat
): CurrentChat {
  const updatedQueue = [...currentChat.updatesQueue];
  updatedQueue.push(event.payload);
  const messageMap = currentChat.messages;

  switch (event.payload.kind) {
    case MESSAGE_EVENT_TYPE.ADD_MESSAGE: {
      messageMap.set(event.payload.message.id, event.payload.message);
      break;
    }

    case MESSAGE_EVENT_TYPE.DELETE_MESSAGE: {
      messageMap.delete(event.payload.id);
      break;
    }

    case MESSAGE_EVENT_TYPE.EDIT_MESSAGE: {
      const message = messageMap.get(event.payload.id);

      if (message) {
        message.text = event.payload.text;
        message.status.isEdited = event.payload.status.isEdited;
        messageMap.set(event.payload.id, message);
      }

      break;
    }

    case MESSAGE_EVENT_TYPE.DELIVERY_UPDATE: {
      const message = messageMap.get(event.payload.id);

      if (message) {
        message.status.isDelivered = event.payload.status.isDelivered;
        messageMap.set(event.payload.id, message);
      }
      break;
    }

    case MESSAGE_EVENT_TYPE.READ_UPDATE: {
      const message = messageMap.get(event.payload.id);

      if (message) {
        message.status.isReaded = event.payload.status.isReaded;
        messageMap.set(event.payload.id, message);
      }
      break;
    }
  }

  return {
    ...currentChat,
    updatesQueue: updatedQueue,
    messages: messageMap,
  };
}
