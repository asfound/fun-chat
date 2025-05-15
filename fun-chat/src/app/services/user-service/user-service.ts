import type { ClientRequestType } from '~/app/constants/constants';
import type { UsersData } from '~/app/store/actions';
import type {
  LoginRequestPayload,
  ClientRequest,
  UserDataPayload,
  CurrentUser,
  GetUsersResponsePayload,
  Message,
} from '~/app/types/interfaces';

import { showModal } from '~/app/components/modal/modal';
import { CLIENT_REQUEST_TYPE } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { changeCurrentUser, setUsers } from '~/app/store/actions';
import { assertErrorResponsePayload } from '~/app/types/guards';

import { fetchMessageHistory } from '../message-service';
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

function getUsers(requestType: ClientRequestType): Promise<GetUsersResponsePayload> {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const request: ClientRequest = {
    id,
    payload: null,
    type: CLIENT_REQUEST_TYPE[requestType],
  };

  return client.sendRequest<GetUsersResponsePayload>(request);
}

export function getAllUsersData(currentUser: string): void {
  Promise.all([
    getUsers(CLIENT_REQUEST_TYPE.USER_ACTIVE),
    getUsers(CLIENT_REQUEST_TYPE.USER_INACTIVE),
  ])
    .then((value) => {
      const users = value.flatMap((payload) => payload.users);

      return Promise.all(
        users
          .filter((user) => user.login !== currentUser)
          .map((user) =>
            fetchMessageHistory(user.login).then((messages): [string, string[]] => [
              user.login,
              getAllUnreadId(currentUser, messages),
            ])
          )
      ).then((unreadCounters) => {
        const unreadCountersMap = new Map<string, string[]>(unreadCounters);
        const usersData: UsersData = {
          users,
          unreadMessagesCounters: unreadCountersMap,
        };
        store.dispatch(setUsers(usersData));
      });
    })
    .catch((error: unknown) => {
      assertErrorResponsePayload(error);
      showModal(error.error);
    });
}

function getAllUnreadId(currentUser: string, messages: Message[]): string[] {
  return messages
    .filter((message) => !message.status.isReaded && message.from !== currentUser)
    .map((message) => message.id);
}
