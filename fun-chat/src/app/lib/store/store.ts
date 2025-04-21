import {
  createReducer,
  initialState,
  type StoreReducer,
} from '~/app/store/reducer.ts';
import { EventEmitter } from '~/app/utils/event-emitter';

import type { ActionType, AllActions } from '../../store/actions.ts';

export type Unsubscribe = () => void;

export interface Store<S> {
  getState: () => S;

  dispatch: (action: AllActions) => void;

  subscribe: (event: ActionType, listener: (payload: S) => void) => Unsubscribe;

  unsubscribeAll: (event: ActionType) => void;
}

export const createStore = <S>(
  reducer: StoreReducer<S>,
  initialState: S
): Store<S> => {
  let state = structuredClone(initialState);
  const eventEmitter = new EventEmitter<S, ActionType>();

  return {
    getState: (): S => structuredClone(state),

    dispatch: (action: AllActions): void => {
      state = reducer(state, action);
      eventEmitter.emit(action.type, state);
    },

    subscribe: (
      event: ActionType,
      listener: (payload: S) => void
    ): Unsubscribe => {
      eventEmitter.subscribe(event, listener);

      return () => {
        eventEmitter.unsubscribe(event, listener);
      };
    },

    unsubscribeAll: (event: ActionType): void => {
      eventEmitter.unsubscribeAll(event);
    },
  };
};

export const store = createStore(createReducer, initialState);
