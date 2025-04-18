import type { CurrentUser, User } from '../types/interfaces';

export const ACTION = {
  SET_SOCKET_STATE: 'socketStateChange',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_USERS: 'setUsers',
  SET_SEARCH_VALUE: 'setSearchValue',
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

export const changeCurrentUser = (
  value: CurrentUser | null
): CurrentUserChange => ({
  type: ACTION.SET_CURRENT_USER,
  payload: value,
});

export type UsersChange = ActionWithPayload<typeof ACTION.SET_USERS, User[]>;

export const setUsers = (value: User[]): UsersChange => ({
  type: ACTION.SET_USERS,
  payload: value,
});

export type SearchInputChange = ActionWithPayload<
  typeof ACTION.SET_SEARCH_VALUE,
  string
>;

export const setSearchInputValue = (value: string): SearchInputChange => ({
  type: ACTION.SET_SEARCH_VALUE,
  payload: value,
});

export type AllActions =
  | SocketStateChange
  | CurrentUserChange
  | UsersChange
  | SearchInputChange;
