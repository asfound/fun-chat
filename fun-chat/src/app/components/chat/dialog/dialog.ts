import { div } from '~/app/utils/create-element';

import { createMessage } from './message/message';

const USER = 'dummy-login';

import styles from './dialog.module.css';

export function createDialog(): HTMLElement {
  const dialogContainer = div({ className: styles.dialog });

  const message = createMessage(USER);
  const message1 = createMessage(USER);
  const message2 = createMessage(USER);
  const message3 = createMessage(USER);

  dialogContainer.append(message, message1, message2, message3);

  requestAnimationFrame(() => {
    dialogContainer.scrollTop = dialogContainer.scrollHeight;
  });

  return dialogContainer;
}
