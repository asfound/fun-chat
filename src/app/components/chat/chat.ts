import type { Render } from '~/app/types/types';

import { store } from '~/app/lib/store/store';
import { article } from '~/app/utils/create-element';

import { createChatInfo } from './chat-info/chat-info';
import styles from './chat.module.css';
import { createDialog } from './dialog/dialog';
import { createMessageForm } from './message-form/message-form';

export function createChat(): HTMLElement {
  const chatContainer = article({ className: styles.chat });

  const render: Render = () => {
    chatContainer.replaceChildren();

    const chatInfo = createChatInfo();

    const dialog = createDialog();

    const messageForm = createMessageForm();

    chatContainer.append(chatInfo, dialog, messageForm);
  };

  render(store.getState());

  return chatContainer;
}
