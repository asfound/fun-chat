import type { Message } from '~/app/types/interfaces';

import { createButton } from '~/app/components/button/button';
import { EMPTY_STRING, ICON_CODE, MESSAGE_STATUS_TEXT } from '~/app/constants/constants';
import { deleteMessage, editMessage } from '~/app/services/message-service';
import { div, icon, p, textarea } from '~/app/utils/create-element';
import formatTime from '~/app/utils/format-time';

import styles from './message.module.css';

export function createMessage(currentUser: string, message: Message): HTMLDivElement {
  const container = div({ className: styles.container });

  const messageElement = div({ className: styles.message });

  const messageHeader = createMessageHeader(message);

  const messageText = p({ textContent: message.text, className: styles.text });

  const isEdited = div({
    textContent: message.status.isEdited ? MESSAGE_STATUS_TEXT.EDITED : '',
    className: styles.edited,
  });

  const messageFooter = div({ className: styles.footer }, [isEdited]);

  if (message.from === currentUser) {
    const messageDeliveryStatus = message.status.isReaded
      ? MESSAGE_STATUS_TEXT.READ
      : message.status.isDelivered
        ? MESSAGE_STATUS_TEXT.DELIVERED
        : MESSAGE_STATUS_TEXT.SENT;

    const messageStatus = div({ textContent: messageDeliveryStatus, className: styles.status });

    const deleteButton = createDeleteButton(message);

    const editButton = createEditButton(message, messageText, messageElement);

    messageFooter.append(messageStatus, editButton, deleteButton);
  } else {
    container.classList.add(styles.partner);
  }

  messageElement.append(messageHeader, messageText, messageFooter);

  container.append(messageElement);

  return container;
}

function createEditControls(
  editButton: HTMLButtonElement,
  textInput: HTMLTextAreaElement,
  messageText: HTMLDivElement,
  messageId: string,
  messageElement: HTMLDivElement
): HTMLDivElement {
  const controls = div({});

  const discardButton = createButton({
    textContent: EMPTY_STRING,
    onClick: () => {
      controls.replaceWith(editButton);
      textInput.replaceWith(messageText);

      messageElement.scrollIntoView();
    },
  });
  const discardIcon = icon({});
  discardIcon.classList.add(ICON_CODE.LIB, ICON_CODE.DISCARD);
  discardButton.append(discardIcon);

  const confirmButton = createButton({
    textContent: EMPTY_STRING,
    onClick: () => {
      editMessage(messageId, textInput.value);
    },
  });
  const confirmIcon = icon({});
  confirmIcon.classList.add(ICON_CODE.LIB, ICON_CODE.CONFIRM);
  confirmButton.append(confirmIcon);

  controls.append(confirmButton, discardButton);

  return controls;
}

function createMessageHeader(message: Message): HTMLDivElement {
  const author = div({ textContent: message.from, className: styles.author });
  const date = div({ textContent: formatTime(message.datetime) });
  return div({ className: styles.header }, [author, date]);
}

function createEditButton(
  message: Message,
  messageText: HTMLParagraphElement,
  messageElement: HTMLDivElement
): HTMLButtonElement {
  const editButton = createButton({
    textContent: EMPTY_STRING,
    onClick: () => {
      const textInput = textarea({ value: message.text, className: styles.text });

      messageText.replaceWith(textInput);
      textInput.style.height = `${textInput.scrollHeight.toString()}px`;
      textInput.scrollIntoView();

      editButton.replaceWith(
        createEditControls(editButton, textInput, messageText, message.id, messageElement)
      );
    },
  });

  const editIcon = icon({});
  editIcon.classList.add(ICON_CODE.LIB, ICON_CODE.EDIT);
  editButton.append(editIcon);

  return editButton;
}

function createDeleteButton(message: Message): HTMLButtonElement {
  const deleteButton = createButton({
    textContent: EMPTY_STRING,
    onClick: () => {
      deleteMessage(message.id);
    },
  });

  const deleteIcon = icon({});
  deleteIcon.classList.add(ICON_CODE.LIB, ICON_CODE.DELETE);
  deleteButton.append(deleteIcon);

  return deleteButton;
}
