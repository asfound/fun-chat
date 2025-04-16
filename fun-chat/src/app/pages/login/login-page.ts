import { createAuthForm } from '~/app/components/auth-form/auth-form';
import { createButton } from '~/app/components/button/button';
import { div } from '~/app/utils/create-element';

export function createLoginPage(): HTMLDivElement {
  const container = div({});

  const form = createAuthForm();

  const infoButton = createButton({ textContent: 'Info' });

  container.append(form, infoButton);

  return container;
}
