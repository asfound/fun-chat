import type {
  ClientRequestType,
  ServerRequestType,
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
  payload: LoginRequestPayload | null;
}

export type ServerMessage = ServerResponse | ServerRequest;

export interface ServerResponse {
  id: string;
  type: ServerResponseType;
  payload: UserDataPayload | ErrorPayload;
}

export interface ServerRequest {
  type: ServerRequestType;
  payload: UserDataPayload;
}

export interface LoginRequestPayload {
  user: {
    login: string;
    password: string;
  };
}

export type LogoutRequestPayload = LoginRequestPayload;

export interface UserDataPayload {
  user: {
    login: string;
    isLogined: boolean;
  };
}

export interface CurrentUser {
  login: string;
  password: string;
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
