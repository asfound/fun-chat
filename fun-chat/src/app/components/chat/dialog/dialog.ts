import type { Unsubscribe } from '~/app/lib/store/store';
import type { NotificationCountData } from '~/app/store/actions';
import type { State } from '~/app/store/reducer';
import type { Message } from '~/app/types/interfaces';
import type { Render } from '~/app/types/types';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { markMessageAsRead } from '~/app/services/message-service';
import { DEFAULT_INCREMENT } from '~/app/services/server-request-handler';
import { ACTION, updateNotificationCount } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessageDivider } from './divider/divider';
import { createMessage } from './message/message';

let isFocused = true;
let divider: HTMLDivElement | null;
let unreadMessages: Message[] = [];

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const messagesMap = new Map<string, HTMLDivElement>();

  let unsubscribe: Unsubscribe | undefined;

  dialogContainer.addEventListener('click', handleFocus);
  dialogContainer.addEventListener('wheel', handleFocus);

  const render: Render = ({ currentUser, currentChat }) => {
    dialogContainer.replaceChildren();
    messagesMap.clear();

    if (currentUser && currentChat) {
      if (currentChat.messageHistory.length > EMPTY_VALUE) {
        const expander = div({ className: styles.expander });

        dialogContainer.append(expander);

        for (const message of currentChat.messageHistory) {
          if (message.from !== currentUser.login && !message.status.isReaded) {
            unreadMessages.push(message);

            if (!divider) {
              isFocused = false;
              divider = createMessageDivider();
              dialogContainer.append(divider);
            }
          }

          const messageElement = createMessage(currentUser.login, message);

          dialogContainer.append(messageElement);
          messagesMap.set(message.id, messageElement);
        }

        if (divider) {
          divider.scrollIntoView();
        } else {
          requestAnimationFrame(() => {
            dialogContainer.scrollTop = dialogContainer.scrollHeight;
          });
        }
      } else {
        const placeholder = div({ textContent: PLACEHOLDER.NO_MESSAGES });
        dialogContainer.append(placeholder);
      }

      unsubscribe = store.subscribe(ACTION.EMIT_CHAT_MESSAGE_EVENT, (state) => {
        handleChatMessageEvent(dialogContainer, state, messagesMap);
      });
    } else {
      const placeholder = div({ textContent: PLACEHOLDER.SELECT_CHAT });
      dialogContainer.append(placeholder);
    }
  };

  render(store.getState());

  store.subscribe(ACTION.SET_CURRENT_CHAT, (state) => {
    if (unsubscribe !== undefined) {
      unsubscribe();
    }
    render(state);
  });

  return dialogContainer;
}

function handleChatMessageEvent(
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
              if (isFocused) {
                markMessageAsRead(message.id);
              }
            }

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

function handleFocus(): void {
  if (!isFocused) {
    isFocused = true;
    divider?.remove();
    divider = null;

    for (const message of unreadMessages) {
      markMessageAsRead(message.id);
    }

    const { currentChat } = store.getState();
    if (currentChat) {
      const notificationData: NotificationCountData = {
        userID: currentChat.userLogin,
      };
      store.dispatch(updateNotificationCount(notificationData));
    }

    unreadMessages = [];
  }
}
