import { store } from '~/app/lib/store/store';
import { ACTION } from '~/app/store/actions';
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

    store.subscribe(ACTION.ADD_CHAT_MESSAGE, ({ currentUser, currentChat }) => {
      if (currentUser && currentChat) {
        const newMessage = currentChat.updatesQueue.shift();
        if (newMessage) {
          const newMessageElement = createMessage(
            currentUser.login,
            newMessage
          );
          dialogContainer.append(newMessageElement);

          requestAnimationFrame(() => {
            dialogContainer.scrollTop = dialogContainer.scrollHeight;
          });
        }
      }
    });
  } else {
    const placeholder = div({ textContent: 'Select chat' });
    dialogContainer.append(placeholder);
  }

  return dialogContainer;
}
