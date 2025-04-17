import { Route } from '~/app/router/route';
import { a, h1, header } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import { createUserDisplay } from './user-display/user-display';

export function createHeader(): HTMLElement {
  const headerElement = header({});

  const currentUser = createUserDisplay();

  const appName = h1({ textContent: 'Fun Chat' });

  const aboutLink = a({ textContent: 'About App', href: Route.ABOUT });

  const logoutButton = createButton({ textContent: 'Logout' });

  headerElement.append(currentUser, appName, aboutLink, logoutButton);

  return headerElement;
}
