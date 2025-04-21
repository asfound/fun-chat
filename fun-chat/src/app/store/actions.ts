import type { CurrentUser, User } from '../types/interfaces';
import type { ChatMessageEvent } from '../types/message-events';
import type { CurrentChat } from './reducer';

export const ACTION = {
  SET_SOCKET_STATE: 'socketStateChange',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_USERS: 'setUsers',
  SET_SEARCH_VALUE: 'setSearchValue',
  UPDATE_USER_STATUS: 'updateUserStatus',

  SET_CURRENT_CHAT: 'setCurrentChat',
  EMIT_CHAT_MESSAGE_EVENT: 'emitChatMessageEvent',
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

export type UsersChange = ActionWithPayload<typeof ACTION.SET_USERS, UsersData>;

export const setUsers = (value: UsersData): UsersChange => ({
  type: ACTION.SET_USERS,
  payload: value,
});

export interface UsersData {
  users: User[];
  unreadMessagesCounters: Map<string, number>;
}

export type SearchInputChange = ActionWithPayload<
  typeof ACTION.SET_SEARCH_VALUE,
  string
>;

export const setSearchInputValue = (value: string): SearchInputChange => ({
  type: ACTION.SET_SEARCH_VALUE,
  payload: value,
});

export type UserStatusChange = ActionWithPayload<
  typeof ACTION.UPDATE_USER_STATUS,
  User
>;

export const updateUserStatus = (value: User): UserStatusChange => ({
  type: ACTION.UPDATE_USER_STATUS,
  payload: value,
});

export type CurrentChatChange = ActionWithPayload<
  typeof ACTION.SET_CURRENT_CHAT,
  CurrentChat
>;

export const setCurrentChat = (value: CurrentChat): CurrentChatChange => ({
  type: ACTION.SET_CURRENT_CHAT,
  payload: value,
});

export type ChatMessageEventEmission = ActionWithPayload<
  typeof ACTION.EMIT_CHAT_MESSAGE_EVENT,
  ChatMessageEvent
>;

export const emitChatMessageEvent = (
  value: ChatMessageEvent
): ChatMessageEventEmission => ({
  type: ACTION.EMIT_CHAT_MESSAGE_EVENT,
  payload: value,
});

export type AllActions =
  | SocketStateChange
  | CurrentUserChange
  | UsersChange
  | SearchInputChange
  | UserStatusChange
  | CurrentChatChange
  | ChatMessageEventEmission;
