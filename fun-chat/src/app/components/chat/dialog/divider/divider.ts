import { div, span } from '~/app/utils/create-element';

import styles from './divider.module.css';

export function createMessageDivider(): HTMLElement {
  const container = div({ className: styles.divider });

  const dividerText = span({
    textContent: 'Unread messages',
    className: styles.text,
  });

  container.append(dividerText);

  return container;
}
