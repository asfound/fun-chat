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
  payload: LoginRequestPayload;
}

export type ServerMessage = ServerResponse | ServerRequest;

export interface ServerResponse {
  id: string;
  type: ServerResponseType;
  payload: LoginResponsePayload | ErrorPayload;
}

export interface ServerRequest {
  type: ServerRequestType;
  payload: LoginResponsePayload;
}

export interface LoginRequestPayload {
  user: {
    login: string;
    password: string;
  };
}

export interface LoginResponsePayload {
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

export interface ErrorPayload {
  error: string;
}
