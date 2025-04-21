import type { ClientRequestType } from '~/app/constants/constants';
import type {
  LoginRequestPayload,
  ClientRequest,
  UserDataPayload,
  CurrentUser,
  GetUsersResponsePayload,
} from '~/app/types/interfaces';

import { CLIENT_REQUEST_TYPE } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { changeCurrentUser, setUsers } from '~/app/store/actions';

import { getWebSocketClient } from '../websocket/websocket-client';

export function authorizeUser(login: string, password: string): Promise<void> {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: LoginRequestPayload = {
    user: {
      login,
      password,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.USER_LOGIN,
  };

  return client.sendRequest<UserDataPayload>(request).then((response) => {
    const userData: CurrentUser = {
      login: response.user.login,
      password,
    };

    store.dispatch(changeCurrentUser(userData));
  });
}

function getUsers(
  requestType: ClientRequestType
): Promise<GetUsersResponsePayload> {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const request: ClientRequest = {
    id,
    payload: null,
    type: CLIENT_REQUEST_TYPE[requestType],
  };

  return client.sendRequest<GetUsersResponsePayload>(request);
}

export function getAllUsers(): void {
  Promise.all([
    getUsers(CLIENT_REQUEST_TYPE.USER_ACTIVE),
    getUsers(CLIENT_REQUEST_TYPE.USER_INACTIVE),
  ])
    .then((value) => {
      const users = value.map((payload) => payload.users);
      store.dispatch(setUsers(users.flat()));
    })
    .catch((error: unknown) => {
      console.log(error);
    });
}
