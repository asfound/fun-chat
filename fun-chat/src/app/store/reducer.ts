import type { CurrentUser, User } from '~/app/types/interfaces';

import type { AllActions } from './actions';

import { loadStateFromSessionStorage } from '../services/session-storage/session-storage';
import { ACTION } from './actions';

export type StoreReducer<S> = (state: S, action: AllActions) => S;
export interface State {
  isWebsocketOpen: boolean;

  currentUser: CurrentUser | null;
  users: User[] | [];

  searchValue: string;
}

export type StoredState = Omit<State, 'isWebsocketOpen'>;

export const defaultState: State = {
  isWebsocketOpen: false,

  currentUser: null,
  users: [],

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
      return {
        ...state,
        users: action.payload,
      };
    }

    case ACTION.SET_SEARCH_VALUE: {
      return {
        ...state,
        searchValue: action.payload,
      };
    }

    case ACTION.UPDATE_USER_STATUS: {
      let users: User[] = structuredClone(state.users);
      const user = action.payload;
      const userExists = users.some(
        (user) => user.login === action.payload.login
      );

      if (userExists) {
        users = users.map((user) =>
          user.login === action.payload.login
            ? { ...user, isLogined: action.payload.isLogined }
            : user
        );
      } else {
        users.push(user);
      }
      return {
        ...state,
        users: users,
      };
    }

    default: {
      return state;
    }
  }
};
