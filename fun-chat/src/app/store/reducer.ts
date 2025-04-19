import type { CurrentUser, Message, User } from '~/app/types/interfaces';

import type { AllActions } from './actions';

import { loadStateFromSessionStorage } from '../services/session-storage/session-storage';
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
  updatesQueue: Message[];
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

// eslint-disable-next-line max-lines-per-function
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

    case ACTION.ADD_CHAT_MESSAGE: {
      if (state.currentChat) {
        const updatedQueue = [...state.currentChat.updatesQueue];
        updatedQueue.push(action.payload);
        return {
          ...state,
          currentChat: {
            ...state.currentChat,
            updatesQueue: updatedQueue,
          },
        };
      }

      return state;
    }

    default: {
      return state;
    }
  }
};
