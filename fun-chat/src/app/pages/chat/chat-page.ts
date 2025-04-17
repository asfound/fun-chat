import { createFooter } from '~/app/components/footer/footer';
import { createHeader } from '~/app/components/header/header';
import { div } from '~/app/utils/create-element';

export function createChatPage(): HTMLDivElement {
  const container = div({});

  const header = createHeader();

  const footer = createFooter();

  container.append(header, footer);

  return container;
}
