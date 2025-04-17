import { a, footer } from '~/app/utils/create-element';

export function createFooter(): HTMLElement {
  const footerElement = footer({});

  const authorLink = a({ textContent: 'asfound' });

  footerElement.append(authorLink);

  return footerElement;
}
