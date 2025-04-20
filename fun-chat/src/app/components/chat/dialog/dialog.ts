import type { State } from '~/app/store/reducer';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
import { MESSAGE_EVENT_TYPE } from '~/app/types/message-events';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessage } from './message/message';

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const { currentUser, currentChat } = store.getState();

  if (currentUser && currentChat) {
    if (currentChat.messageHistory.length > EMPTY_VALUE) {
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
      const placeholder = div({ textContent: PLACEHOLDER.NO_MESSAGES });
      dialogContainer.append(placeholder);
    }

    store.subscribe(ACTION.EMIT_CHAT_MESSAGE_EVENT, (state) => {
      handleChatMessageEvent(dialogContainer, state);
    });
  } else {
    const placeholder = div({ textContent: PLACEHOLDER.SELECT_CHAT });
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
