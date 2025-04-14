import type { State, Store } from '../types/interfaces';
import type { EmitterCallback } from '../types/types';
import type { EventType } from './events';

import { Route } from '../router/route';
import { EventEmitter } from '../utils/event-emitter';

export function createStore(initialState: State): Store {
  const state = { ...initialState };
  const eventBus = new EventEmitter<State, EventType>();

  return {
    getState: (): State => state,

    updateState: (newState: Partial<State>): void => {
      Object.assign(state, newState);
    },

    subscribe: (event: EventType, callback: EmitterCallback<State>): void => {
      eventBus.subscribe(event, callback);
    },
  };
}

const defaultState: State = {
  currentAppPage: Route.LOGIN,

  isWebsocketOpen: false,
};

export const store = createStore(defaultState);
