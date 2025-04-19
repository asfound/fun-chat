import { article } from '~/app/utils/create-element';

import { createChatInfo } from './chat-info/chat-info';
import styles from './chat.module.css';
import { createDialog } from './dialog/dialog';
import { createMessageForm } from './message-form/message-form';

export function createChat(): HTMLElement {
  const chatContainer = article({ className: styles.chat });

  const chatInfo = createChatInfo();

  const dialog = createDialog();

  const messageForm = createMessageForm();

  chatContainer.append(chatInfo, dialog, messageForm);

  return chatContainer;
}
