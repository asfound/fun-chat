import { div, h2 } from '~/app/utils/create-element';

import styles from './chat-info.module.css';

export function createChatInfo(): HTMLElement {
  const container = div({ className: styles.container });

  const chatPartner = h2({ textContent: 'Partner', className: styles.login });

  const partnerStatus = div({
    textContent: 'Status',
    className: styles.status,
  });

  container.append(chatPartner, partnerStatus);

  return container;
}
