import { USER_LABEL } from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { div, span } from '~/app/utils/create-element';

export function createUserDisplay(): HTMLElement {
  const container = div({});

  const labelElement = span({ textContent: USER_LABEL });

  const username = store.getState().currentUser?.login;

  const usernameElement = span({ textContent: username });

  container.append(labelElement, usernameElement);

  return container;
}
