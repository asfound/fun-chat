import { div, span } from '~/app/utils/create-element';

export function createUserDisplay(): HTMLElement {
  const container = div({});

  const labelElement = span({ textContent: 'User: ' });

  const usernameElement = span({ textContent: 'Hardcoded name' });

  container.append(labelElement, usernameElement);

  return container;
}
