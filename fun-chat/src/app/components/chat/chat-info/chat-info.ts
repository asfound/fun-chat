import { store } from '~/app/lib/store/store';
import { div, h2 } from '~/app/utils/create-element';

import styles from './chat-info.module.css';

export function createChatInfo(): HTMLElement {
  const container = div({ className: styles.container });

  const { currentChat, users } = store.getState();

  if (currentChat) {
    const user = users.get(currentChat.userLogin);

    const chatPartner = h2({
      textContent: currentChat.userLogin,
      className: styles.login,
    });

    const partnerStatus = div({
      textContent: user?.isLogined ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE,
      className: styles.status,
    });

    container.append(chatPartner, partnerStatus);
  }

  return container;
}

const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};
