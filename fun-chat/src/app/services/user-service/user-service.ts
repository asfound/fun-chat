import type {
  LoginRequestPayload,
  ClientRequest,
  LoginResponsePayload,
  CurrentUser,
} from '~/app/types/interfaces';

import { CLIENT_REQUEST_TYPE } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { changeCurrentUser } from '~/app/store/actions';

import { getWebSocketClient } from '../websocket/websocket-client';

export function authorizeUser(login: string, password: string): void {
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

  client
    .sendRequest<LoginResponsePayload>(request)
    .then((response) => {
      const userData: CurrentUser = {
        login: response.user.login,
        password,
      };

      store.dispatch(changeCurrentUser(userData));
    })
    .catch((error: unknown) => {
      console.log(error);
    });
}
