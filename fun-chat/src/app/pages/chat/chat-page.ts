import { createContacts } from '~/app/components/contacts/contacts';
import { createFooter } from '~/app/components/footer/footer';
import { createHeader } from '~/app/components/header/header';
import { store } from '~/app/lib/store/store';
import { getAllUsers } from '~/app/services/user-service/user-service';
import { ACTION } from '~/app/store/actions';
import { div, section } from '~/app/utils/create-element';

export function createChatPage(): HTMLDivElement {
  const container = div({});

  if (store.getState().isWebsocketOpen) {
    getAllUsers();
  }

  store.subscribe(ACTION.SET_SOCKET_STATE, getAllUsers);

  const header = createHeader();

  const contactList = createContacts();

  const sectionElement = section({}, [contactList]);

  const footer = createFooter();

  container.append(header, sectionElement, footer);

  return container;
}
