import { createContacts } from '~/app/components/contacts/contacts';
import { createFooter } from '~/app/components/footer/footer';
import { createHeader } from '~/app/components/header/header';
import { store } from '~/app/lib/store/store';
import { getAllUsers } from '~/app/services/user-service/user-service';
import { ACTION } from '~/app/store/actions';
import { div, section } from '~/app/utils/create-element';

import styles from './chat-page.module.css';

export function createChatPage(): HTMLDivElement {
  const wrapper = div({ className: styles.wrapper });

  if (store.getState().isWebsocketOpen) {
    getAllUsers();
  }

  store.subscribe(ACTION.SET_SOCKET_STATE, getAllUsers);

  const header = createHeader();

  const contactList = createContacts();

  const sectionElement = section({ className: styles.section }, [contactList]);

  const footer = createFooter();

  wrapper.append(header, sectionElement, footer);

  return wrapper;
}
