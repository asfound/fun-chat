import { createAuthForm } from '~/app/components/form/form';
import { Route } from '~/app/router/route';
import { a, div } from '~/app/utils/create-element';

export function createLoginPage(): HTMLDivElement {
  const container = div({});

  const form = createAuthForm();

  const aboutLink = a({ textContent: 'About App', href: Route.ABOUT });

  container.append(form, aboutLink);

  return container;
}
