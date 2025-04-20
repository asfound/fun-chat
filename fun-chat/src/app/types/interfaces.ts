import type {
  ClientRequestType,
  SERVER_REQUEST_TYPE,
  ServerResponseType,
} from '../constants/constants';

export interface ButtonProperties {
  textContent: string;
  type?: HTMLButtonElement['type'];
  className?: string;
  onClick?: (event?: Event) => void;
  disabled?: boolean;
}

export interface ClientRequest {
  id: string;
  type: ClientRequestType;
  payload:
    | LoginRequestPayload
    | SendMessagePayload
    | FetchHistoryPayload
    | null;
}

export interface ServerResponse {
  id: string;
  type: ServerResponseType;
  payload:
    | UserDataPayload
    | MessageDataPayload
    | MessagesPayload
    | ErrorPayload;
}

export interface UserDataRequestLogin {
  type: typeof SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGIN;
  payload: UserDataPayload;
}

export interface UserDataRequestLogout {
  type: typeof SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGOUT;
  payload: UserDataPayload;
}

export interface MessageDataRequest {
  type: typeof SERVER_REQUEST_TYPE.MSG_SEND;
  message: MessageDataPayload;
}

export type ServerRequest =
  | UserDataRequestLogin
  | UserDataRequestLogout
  | MessageDataRequest;

export type ServerMessage = ServerResponse | ServerRequest;

export interface LoginRequestPayload {
  user: CurrentUser;
}

export interface CurrentUser {
  login: string;
  password: string;
}

export type LogoutRequestPayload = LoginRequestPayload;

export interface UserDataPayload {
  user: User;
}

export interface User {
  login: string;
  isLogined: boolean;
}

export interface GetUsersResponsePayload {
  users: User[];
}

export interface ErrorPayload {
  error: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}

export interface SendMessagePayload {
  message: Pick<Message, 'to' | 'text'>;
}

export interface FetchHistoryPayload {
  user: {
    login: string;
  };
}

export interface MessageDataPayload {
  message: Message;
}

export interface MessagesPayload {
  messages: Message[];
}
