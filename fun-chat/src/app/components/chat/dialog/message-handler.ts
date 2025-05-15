import type { NotificationCountData } from '~/app/store/actions';
import type { State } from '~/app/store/reducer';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { markMessageAsRead } from '~/app/services/message-service';
import { DEFAULT_INCREMENT } from '~/app/services/server-request-handler';
import { updateNotificationCount } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import {
  addUnreadMessage,
  getDivider,
  getIsFocused,
  handleFocus,
} from './dialog';
import styles from './dialog.module.css';
import { createMessage } from './message/message';

export function handleChatMessageEvent(
  dialogContainer: HTMLDivElement,
  state: State,
  messageElements: Map<string, HTMLDivElement>
): void {
  const { currentUser, currentChat } = state;

  if (currentUser && currentChat) {
    const event = currentChat.updatesQueue.shift();

    if (event) {
      switch (event.kind) {
        case MESSAGE_EVENT_TYPE.ADD_MESSAGE: {
          const message = currentChat.messages.get(event.message.id);
          if (message) {
            const newMessageElement = createMessage(
              currentUser.login,
              event.message
            );

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

          break;
        }
      }
    }
  }
}

function dispatchNotification(userLogin: string, messageId: string): void {
  const notificationData: NotificationCountData = {
    userID: userLogin,
    messageId,
  };

  store.dispatch(updateNotificationCount(notificationData));
}
