import { createContacts } from '~/app/components/contact-list/contact-list';
import { createFooter } from '~/app/components/footer/footer';
import { createHeader } from '~/app/components/header/header';
import { div, section } from '~/app/utils/create-element';

export function createChatPage(): HTMLDivElement {
  const container = div({});

  const header = createHeader();

  const contactList = createContacts();

  const sectionElement = section({}, [contactList]);

  const footer = createFooter();

  container.append(header, sectionElement, footer);

  return container;
}
