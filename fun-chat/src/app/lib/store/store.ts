import {
  createReducer,
  defaultState,
  type StoreReducer,
} from '~/app/store/reducer.ts';
import { EventEmitter } from '~/app/utils/event-emitter';

import type { ActionType, AllActions } from '../../store/actions.ts';

export interface Store<S> {
  getState: () => S;

  dispatch: (action: AllActions) => void;

  subscribe: (event: ActionType, listener: (payload: S) => void) => void;
}

export const createStore = <S>(
  reducer: StoreReducer<S>,
  initialState: S
): Store<S> => {
  let state = { ...initialState };
  const eventEmitter = new EventEmitter<S, ActionType>();

  return {
    getState: (): S => structuredClone(state),

    dispatch: (action: AllActions): void => {
      state = reducer(state, action);
      console.log(state);
      eventEmitter.emit(action.type, state);
    },

    subscribe: (event: ActionType, listener: (payload: S) => void): void => {
      eventEmitter.subscribe(event, listener);
    },
  };
};

export const store = createStore(createReducer, defaultState);
