import type { Message } from '~/app/types/interfaces';

import { div, p } from '~/app/utils/create-element';

import styles from './message.module.css';

export function createMessage(
  currentUser: string,
  message: Message
): HTMLElement {
  const container = div({ className: styles.container });

  const messageElement = div({ className: styles.message });

  const author = div({ textContent: message.from });

  const date = div({ textContent: message.datetime.toString() });

  const messageHeader = div({ className: styles.header }, [author, date]);

  const messageContent = p({
    textContent: message.text,
    className: styles.text,
  });

  const isEdited = div({
    textContent: message.status.isEdited ? 'Edited' : '',
  });

  const messageFooter = div({ className: styles.footer }, [isEdited]);

  if (message.from === currentUser) {
    const messageDeliveryStatus = message.status.isReaded
      ? 'Read'
      : message.status.isDelivered
        ? 'Delivered'
        : 'Sent';

    const messageStatus = div({ textContent: messageDeliveryStatus });

    messageFooter.append(messageStatus);
  } else {
    messageElement.classList.add(styles.partner);
  }

  messageElement.append(messageHeader, messageContent, messageFooter);

  container.append(messageElement);

  return container;
}
