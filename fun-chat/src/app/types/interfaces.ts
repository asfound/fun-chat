import type { Route } from '../router/route';
import type { EventType } from '../store/events';
import type { EmitterCallback } from './types';

export interface State {
  currentAppPage: Route;

  isWebsocketOpen: boolean;
}

export interface Store {
  getState: () => State;

  updateState: (newState: Partial<State>) => void;

  subscribe: (event: EventType, callback: EmitterCallback<State>) => void;
}
