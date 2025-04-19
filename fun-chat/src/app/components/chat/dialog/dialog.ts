import type { State } from '~/app/store/reducer';

import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessage } from './message/message';

const ZERO = 0;

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const { currentUser, currentChat } = store.getState();

  if (currentUser && currentChat) {
    if (currentChat.messageHistory.length > ZERO) {
      const expander = div({ className: styles.expander });

      dialogContainer.append(expander);

      for (const message of currentChat.messageHistory) {
        const messageElement = createMessage(currentUser.login, message);

        dialogContainer.append(messageElement);
      }

      requestAnimationFrame(() => {
        dialogContainer.scrollTop = dialogContainer.scrollHeight;
      });
    } else {
      const placeholder = div({ textContent: 'No messages' });
      dialogContainer.append(placeholder);
    }

    store.subscribe(ACTION.ADD_CHAT_MESSAGE, (state) => {
      handleChatMessageEvent(dialogContainer, state);
    });
  } else {
    const placeholder = div({ textContent: 'Select chat' });
    dialogContainer.append(placeholder);
  }

  return dialogContainer;
}

function handleChatMessageEvent(
  dialogContainer: HTMLDivElement,
  state: State
): void {
  const { currentUser, currentChat } = state;
  if (currentUser && currentChat) {
    const event = currentChat.updatesQueue.shift();

    if (event) {
      switch (event.kind) {
        case MESSAGE_EVENT_TYPE.ADD_MESSAGE: {
          const newMessageElement = createMessage(
            currentUser.login,
            event.message
          );
          dialogContainer.append(newMessageElement);

          requestAnimationFrame(() => {
            dialogContainer.scrollTop = dialogContainer.scrollHeight;
          });
        }
      }
    }
  }
}
