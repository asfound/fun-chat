import { createAuthForm } from '~/app/components/form/form';
import { a, div } from '~/app/utils/create-element';

export function createLoginPage(): HTMLDivElement {
  const container = div({});

  const form = createAuthForm();

  const infoLink = a({ textContent: 'Info', href: '#info' });

  container.append(form, infoLink);

  return container;
}
