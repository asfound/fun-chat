import type { Unsubscribe } from '~/app/lib/store/store';
import type { NotificationCountData } from '~/app/store/actions';
import type { CurrentChat } from '~/app/store/reducer';
import type { CurrentUser, Message } from '~/app/types/interfaces';
import type { Render } from '~/app/types/types';

import { EMPTY_VALUE, PLACEHOLDER } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { markMessageAsRead } from '~/app/services/message-service';
import { ACTION, updateNotificationCount } from '~/app/store/actions';
import { div } from '~/app/utils/create-element';

import styles from './dialog.module.css';
import { createMessageDivider } from './divider/divider';
import { handleChatMessageEvent } from './message-handler';
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
    divider = null;
    unreadMessages = [];
    isFocused = true;

    if (currentUser && currentChat) {
      if (currentChat.messageHistory.length > EMPTY_VALUE) {
        const dialogProperties: NonEmptyDialogProperties = {
          dialogContainer,
          currentChat,
          currentUser,
          messagesMap,
        };

        renderNonEmptyDialog(dialogProperties);
      } else {
        dialogContainer.append(div({ textContent: PLACEHOLDER.NO_MESSAGES }));
      }

      unsubscribe = store.subscribe(ACTION.EMIT_CHAT_MESSAGE_EVENT, (state) => {
        handleChatMessageEvent(dialogContainer, state, messagesMap);
      });
    } else {
      dialogContainer.append(div({ textContent: PLACEHOLDER.SELECT_CHAT }));
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

interface NonEmptyDialogProperties {
  dialogContainer: HTMLElement;
  currentChat: CurrentChat;
  currentUser: CurrentUser;
  messagesMap: Map<string, HTMLDivElement>;
}

function renderNonEmptyDialog(properties: NonEmptyDialogProperties): void {
  const { dialogContainer, currentChat, currentUser, messagesMap } = properties;

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
}

export function handleFocus(): void {
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

export function getIsFocused(): boolean {
  return isFocused;
}

export function addUnreadMessage(message: Message): void {
  unreadMessages.push(message);
}

export function getDivider(): HTMLDivElement | null {
  return divider;
}
