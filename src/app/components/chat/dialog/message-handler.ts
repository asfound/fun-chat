import type { NotificationCountData } from '~/app/store/actions';
import type { CurrentChat, State } from '~/app/store/reducer';
import type { CurrentUser } from '~/app/types/interfaces';
import type { AddMessageEvent, DeleteMessageEvent } from '~/app/types/message-events';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { markMessageAsRead } from '~/app/services/message-service';
import { DEFAULT_INCREMENT } from '~/app/services/server-request-handler';
import { updateNotificationCount } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import { addUnreadMessage, getDivider, getIsFocused, handleFocus } from './dialog';
import styles from './dialog.module.css';
import { createMessage } from './message/message';

export function handleChatMessageEvent(
  dialogContainer: HTMLDivElement,
  state: State,
  messageElements: Map<string, HTMLDivElement>
): void {
  const { currentUser, currentChat } = state;

  if (!currentUser || !currentChat) return;

  const event = currentChat.updatesQueue.shift();
  if (!event) return;

  switch (event.kind) {
    case MESSAGE_EVENT_TYPE.ADD_MESSAGE: {
      handleAddMessage({ currentUser, currentChat, event, dialogContainer, messageElements });

      break;
    }

    case MESSAGE_EVENT_TYPE.DELIVERY_UPDATE:
    case MESSAGE_EVENT_TYPE.READ_UPDATE:
    case MESSAGE_EVENT_TYPE.EDIT_MESSAGE: {
      const messageElement = messageElements.get(event.id);
      const message = currentChat.messages.get(event.id);

      if (messageElement && message) {
        const newMessageElement = createMessage(currentUser.login, message);

        messageElement.replaceWith(newMessageElement);
        messageElements.set(message.id, newMessageElement);
      }

      break;
    }

    case MESSAGE_EVENT_TYPE.DELETE_MESSAGE: {
      handleDeleteMessage({ currentChat, event, dialogContainer, messageElements });

      break;
    }
  }
}

interface HandleDeleteMessageProperties {
  currentChat: CurrentChat;
  event: DeleteMessageEvent;
  dialogContainer: HTMLElement;
  messageElements: Map<string, HTMLDivElement>;
}

function handleDeleteMessage(properties: HandleDeleteMessageProperties): void {
  const { currentChat, event, dialogContainer, messageElements } = properties;
  const messageElement = messageElements.get(event.id);

  if (messageElement) {
    messageElement.remove();
    messageElements.delete(event.id);
  }

  if (currentChat.messages.size === EMPTY_VALUE) {
    dialogContainer.replaceChildren();
    const placeholder = div({ textContent: PLACEHOLDER.NO_MESSAGES });

    dialogContainer.append(placeholder);
  }
}

function dispatchNotification(userLogin: string, messageId: string): void {
  const notificationData: NotificationCountData = {
    userID: userLogin,
    messageId,
  };

  store.dispatch(updateNotificationCount(notificationData));
}

interface HandleAddMessageProperties {
  currentUser: CurrentUser;
  currentChat: CurrentChat;
  event: AddMessageEvent;
  dialogContainer: HTMLElement;
  messageElements: Map<string, HTMLDivElement>;
}

function handleAddMessage(properties: HandleAddMessageProperties): void {
  const {
    currentUser,
    currentChat,
    event,
    dialogContainer,

    messageElements,
  } = properties;

  const message = currentChat.messages.get(event.message.id);
  if (!message) return;

  const newMessageElement = createMessage(currentUser.login, event.message);

  if (currentChat.messages.size === DEFAULT_INCREMENT) {
    dialogContainer.replaceChildren();
    const expander = div({ className: styles.expander });

    dialogContainer.append(expander);
  }

  dialogContainer.append(newMessageElement);
  messageElements.set(message.id, newMessageElement);

  if (currentUser.login === message.from) {
    handleFocus();
  } else {
    if (getIsFocused()) {
      markMessageAsRead(message.id);
    } else {
      addUnreadMessage(message);

      dispatchNotification(message.from, message.id);
    }
  }

  const divider = getDivider();
  if (divider) {
    divider.scrollIntoView();
  } else {
    requestAnimationFrame(() => {
      dialogContainer.scrollTop = dialogContainer.scrollHeight;
    });
  }
}
