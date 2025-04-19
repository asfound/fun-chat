import { store } from '~/app/lib/store/store';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessage } from './message/message';

const ZERO = 0;

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const { currentUser, currentChat } = store.getState();

  if (currentUser && currentChat) {
    if (currentChat.messages.length > ZERO) {
      const expander = div({ className: styles.expander });

      dialogContainer.append(expander);

      for (const message of currentChat.messages) {
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
  } else {
    const placeholder = div({ textContent: 'Select chat' });
    dialogContainer.append(placeholder);
  }

  return dialogContainer;
}
