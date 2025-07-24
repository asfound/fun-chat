import { createChat } from '~/app/components/chat/chat';
import { createContacts } from '~/app/components/contacts/contacts';
import { createFooter } from '~/app/components/footer/footer';
import { createHeader } from '~/app/components/header/header';
import { store } from '~/app/lib/store/store';
import { getAllUsersData } from '~/app/services/user-service/user-service';
import { ACTION } from '~/app/store/actions';
import { div, section } from '~/app/utils/create-element';

import styles from './chat-page.module.css';

export function createChatPage(): HTMLDivElement {
  const wrapper = div({ className: styles.wrapper });

  const { isWebsocketOpen, currentUser } = store.getState();

  if (isWebsocketOpen && currentUser) {
    getAllUsersData(currentUser.login);
  }

  store.subscribe(ACTION.SET_SOCKET_STATE, ({ currentUser }) => {
    if (currentUser) {
      getAllUsersData(currentUser.login);
    }
  });

  const header = createHeader();

  const contactList = createContacts();

  const chat = createChat();

  const sectionElement = section({ className: styles.section }, [contactList, chat]);

  const footer = createFooter();

  wrapper.append(header, sectionElement, footer);

  return wrapper;
}
