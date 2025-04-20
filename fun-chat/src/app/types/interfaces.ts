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

//  Message
export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}

// Client requests
export interface ClientRequest {
  id: string;
  type: ClientRequestType;
  payload:
    | LoginRequestPayload
    | SendMessagePayload
    | ReadMessagePayload
    | FetchHistoryPayload
    | null;
}

export interface LoginRequestPayload {
  user: CurrentUser;
}

export type LogoutRequestPayload = LoginRequestPayload;

export interface CurrentUser {
  login: string;
  password: string;
}

export interface SendMessagePayload {
  message: Pick<Message, 'to' | 'text'>;
}

export interface ReadMessagePayload {
  message: Pick<Message, 'id'>;
}

export interface FetchHistoryPayload {
  user: {
    login: string;
  };
}

export interface GetUsersResponsePayload {
  users: User[];
}

// Server

export type ServerMessage = ServerResponse | ServerRequest;

// Server responses
export interface ServerResponse {
  id: string;
  type: ServerResponseType;
  payload:
    | UserDataPayload
    | MessageDataPayload
    | MessagesPayload
    | ErrorPayload;
}

export interface UserDataPayload {
  user: User;
}

export interface User {
  login: string;
  isLogined: boolean;
}

export interface MessageDataPayload {
  message: Message;
}

export interface MessagesPayload {
  messages: Message[];
}

export interface ErrorPayload {
  error: string;
}

// Server requests

export type ServerRequest =
  | UserDataRequestLogin
  | UserDataRequestLogout
  | MessageDataRequest
  | DeliveryStatusRequest
  | ReadStatusRequest;

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
  payload: MessageDataPayload;
}

export interface DeliveryStatusRequest {
  type: typeof SERVER_REQUEST_TYPE.MSG_DELIVER;
  payload: DeliveryStatusChangePayload;
}

export interface DeliveryStatusChangePayload {
  message: {
    id: string;
    status: Pick<MessageStatus, 'isDelivered'>;
  };
}

export interface ReadStatusRequest {
  type: typeof SERVER_REQUEST_TYPE.MSG_READ;
  payload: ReadStatusChangePayload;
}

export interface ReadStatusChangePayload {
  message: {
    id: string;
    status: Pick<MessageStatus, 'isReaded'>;
  };
}
