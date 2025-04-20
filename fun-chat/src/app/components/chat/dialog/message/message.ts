import type { Message } from '~/app/types/interfaces';

import { createButton } from '~/app/components/button/button';
import { EMPTY_STRING } from '~/app/constants/constants';
import { deleteMessage } from '~/app/services/message-service';
import { div, icon, p } from '~/app/utils/create-element';

import styles from './message.module.css';

export function createMessage(
  currentUser: string,
  message: Message
): HTMLDivElement {
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
    className: styles.edited,
  });

  const messageFooter = div({ className: styles.footer }, [isEdited]);

  if (message.from === currentUser) {
    const messageDeliveryStatus = message.status.isReaded
      ? 'Read'
      : message.status.isDelivered
        ? 'Delivered'
        : 'Sent';

    const messageStatus = div({
      textContent: messageDeliveryStatus,
      className: styles.status,
    });

    const deleteButton = createButton({
      textContent: EMPTY_STRING,
      onClick: () => {
        deleteMessage(message.id);
      },
    });
    const deleteIcon = icon({});

    deleteIcon.classList.add('fas', 'fa-xmark');
    deleteButton.append(deleteIcon);

    const editButton = createButton({
      textContent: EMPTY_STRING,
    });
    const editIcon = icon({});

    editIcon.classList.add('fas', 'fa-pen-to-square');
    editButton.append(editIcon);

    messageFooter.append(messageStatus, editButton, deleteButton);
  } else {
    container.classList.add(styles.partner);
  }

  messageElement.append(messageHeader, messageContent, messageFooter);

  container.append(messageElement);

  return container;
}
