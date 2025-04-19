import { div, p } from '~/app/utils/create-element';

import styles from './message.module.css';

export function createMessage(user: string): HTMLElement {
  const container = div({ className: styles.container });

  const message = div({ className: styles.message });

  const author = div({ textContent: user });
  const date = div({ textContent: '01/01/25' });

  const messageHeader = div({ className: styles.header }, [author, date]);

  const messageContent = p({
    textContent: 'Message content',
    className: styles.text,
  });

  const isEdited = div({ textContent: 'Edited' });

  const messageStatus = div({ textContent: 'Delivered' });

  const messageFooter = div({ className: styles.footer }, [
    isEdited,
    messageStatus,
  ]);

  message.append(messageHeader, messageContent, messageFooter);

  container.append(message);

  return container;
}
