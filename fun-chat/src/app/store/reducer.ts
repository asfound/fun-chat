import type { CurrentUser } from '~/app/types/interfaces';

import type { AllActions } from './actions';

import { ACTION } from './actions';

export type StoreReducer<S> = (state: S, action: AllActions) => S;
export interface State {
  isWebsocketOpen: boolean;
  currentUser: CurrentUser | null;
}

export const defaultState: State = {
  isWebsocketOpen: false,
  currentUser: null,
};

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

    default: {
      return state;
    }
  }
};
