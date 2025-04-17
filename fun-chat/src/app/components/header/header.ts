import type {
  ClientRequest,
  LogoutRequestPayload,
  LogoutResponsePayload,
} from '~/app/types/interfaces';

import { CLIENT_REQUEST_TYPE } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { Route } from '~/app/router/route';
import { getWebSocketClient } from '~/app/services/websocket/websocket-client';
import { changeCurrentUser } from '~/app/store/actions';
import { a, h1, header } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import { createUserDisplay } from './user-display/user-display';

export function createHeader(): HTMLElement {
  const headerElement = header({});

  const currentUser = createUserDisplay();

  const appName = h1({ textContent: 'Fun Chat' });

  const aboutLink = a({ textContent: 'About App', href: Route.ABOUT });

  const logoutButton = createButton({
    textContent: 'Logout',
    onClick: handleLogout,
  });

  headerElement.append(currentUser, appName, aboutLink, logoutButton);

  return headerElement;
}

function handleLogout(): void {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const { currentUser } = store.getState();

  if (currentUser) {
    const payload: LogoutRequestPayload = {
      user: {
        login: currentUser.login,
        password: currentUser.password,
      },
    };

    const request: ClientRequest = {
      id,
      payload,
      type: CLIENT_REQUEST_TYPE.USER_LOGOUT,
    };

    client
      .sendRequest<LogoutResponsePayload>(request)
      .then(() => {
        store.dispatch(changeCurrentUser(null));
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }
}
