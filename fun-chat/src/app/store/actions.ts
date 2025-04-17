import type { CurrentUser } from '../types/interfaces';

export const ACTION = {
  SET_SOCKET_STATE: 'socketStateChange',
  SET_CURRENT_USER: 'setCurrentUser',
} as const;

export type ActionType = (typeof ACTION)[keyof typeof ACTION];

export interface ActionWithPayload<A extends ActionType, T> {
  type: A;
  payload: T;
}

// TODO refactor to not duplicate

export type SocketStateChange = ActionWithPayload<
  typeof ACTION.SET_SOCKET_STATE,
  boolean
>;

export const setSocketState = (value: boolean): SocketStateChange => ({
  type: ACTION.SET_SOCKET_STATE,
  payload: value,
});

export type CurrentUserChange = ActionWithPayload<
  typeof ACTION.SET_CURRENT_USER,
  CurrentUser | null
>;

export type AllActions = SocketStateChange | CurrentUserChange;
