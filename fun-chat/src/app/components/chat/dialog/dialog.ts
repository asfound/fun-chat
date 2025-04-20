import type { Unsubscribe } from '~/app/lib/store/store';
import type { State } from '~/app/store/reducer';
import type { Render } from '~/app/types/types';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { markMessageAsRead } from '~/app/services/message-service';
import { ACTION } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessage } from './message/message';

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const messagesMap = new Map<string, HTMLDivElement>();

  let unsubscribe: Unsubscribe | undefined;

  const render: Render = ({ currentUser, currentChat }) => {
    dialogContainer.replaceChildren();
    messagesMap.clear();

    if (currentUser && currentChat) {
      if (currentChat.messageHistory.length > EMPTY_VALUE) {
        const expander = div({ className: styles.expander });

        dialogContainer.append(expander);

        for (const message of currentChat.messageHistory) {
          const messageElement = createMessage(currentUser.login, message);

          dialogContainer.append(messageElement);
          messagesMap.set(message.id, messageElement);
        }

        requestAnimationFrame(() => {
          dialogContainer.scrollTop = dialogContainer.scrollHeight;
        });
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
    console.log(currentChat);
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

            dialogContainer.append(newMessageElement);

            if (currentUser.login !== message.from && currentChat.isFocused) {
              markMessageAsRead(message.id);
            }

            requestAnimationFrame(() => {
              dialogContainer.scrollTop = dialogContainer.scrollHeight;
            });
          }

          break;
        }

        case MESSAGE_EVENT_TYPE.DELIVERY_UPDATE: {
          const messageElement = messageElements.get(event.id);
          const message = currentChat.messages.get(event.id);

          if (messageElement && message) {
            const newMessageElement = createMessage(currentUser.login, message);

            messageElement.replaceWith(newMessageElement);
            messageElements.set(message.id, newMessageElement);
          }
        }
      }
    }
  }
}
