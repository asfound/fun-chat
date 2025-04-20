import type { Render } from '~/app/types/types';

import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
import { div, h2 } from '~/app/utils/create-element';

import styles from './chat-info.module.css';

export function createChatInfo(): HTMLElement {
  const container = div({ className: styles.container });

  let isOnline = false;

  const render: Render = ({ currentChat, users }) => {
    container.replaceChildren();
    if (currentChat) {
      const user = users.get(currentChat.userLogin);

      isOnline = user?.isLogined ?? false;

      const chatPartner = h2({
        textContent: currentChat.userLogin,
        className: styles.login,
      });

      const partnerStatus = div({
        textContent: isOnline ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE,
        className: styles.status,
      });

      if (isOnline) {
        partnerStatus.classList.add(styles.online);
      }

      container.append(chatPartner, partnerStatus);
    }
  };

  render(store.getState());

  store.subscribe(ACTION.UPDATE_USER_STATUS, (state) => {
    const { currentChat, users } = state;

    if (currentChat) {
      const user = users.get(currentChat.userLogin);

      if (user?.isLogined !== isOnline) {
        render(state);
      }
    }
  });

  return container;
}

// TODO MOVE TO CONSTANTS

const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};
