import type {
  ClientRequest,
  LogoutRequestPayload,
  UserDataPayload,
} from '~/app/types/interfaces';

import {
  APP_NAME,
  BUTTON_TEXT,
  CLIENT_REQUEST_TYPE,
} from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { Route } from '~/app/router/route';
import { navigate } from '~/app/router/router';
import { getWebSocketClient } from '~/app/services/websocket/websocket-client';
import { ACTION, changeCurrentUser, setCurrentChat } from '~/app/store/actions';
import { assertErrorResponsePayload } from '~/app/types/guards';
import { div, h1, header } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import { showModal } from '../modal/modal';
import styles from './header.module.css';
import { createUserDisplay } from './user-display/user-display';

export function createHeader(): HTMLElement {
  const headerElement = header({ className: styles.header });

  const currentUser = createUserDisplay();

  const appName = h1({ textContent: APP_NAME, className: styles.title });

  const aboutButton = createButton({
    textContent: BUTTON_TEXT.ABOUT,
    onClick: () => {
      navigate(Route.ABOUT);
    },
  });

  const logoutButton = createButton({
    textContent: BUTTON_TEXT.LOGOUT,
    onClick: handleLogout,
  });

  const titleContainer = div({ className: styles.titleContainer }, [
    appName,
    currentUser,
  ]);

  headerElement.append(aboutButton, titleContainer, logoutButton);

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
      .sendRequest<UserDataPayload>(request)
      .then(() => {
        store.dispatch(setCurrentChat(null));
        store.dispatch(changeCurrentUser(null));
        store.unsubscribeAll(ACTION.SET_CURRENT_CHAT);
        store.unsubscribeAll(ACTION.SET_CURRENT_USER);
        navigate(Route.LOGIN);
      })
      .catch((error: unknown) => {
        assertErrorResponsePayload(error);
        showModal(error.error);
      });
  }
}
