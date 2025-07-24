import { DIVIDER_TEXT } from '~/app/constants/constants';
import { div, span } from '~/app/utils/create-element';

import styles from './divider.module.css';

export function createMessageDivider(): HTMLDivElement {
  const container = div({ className: styles.divider });

  const dividerText = span({
    textContent: DIVIDER_TEXT,
    className: styles.text,
  });

  container.append(dividerText);

  return container;
}
