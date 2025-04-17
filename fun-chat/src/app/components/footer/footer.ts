import { EXTERNAL_LINK } from '~/app/constants/constants';
import { a, footer, span } from '~/app/utils/create-element';

import styles from './footer.module.css';

export function createFooter(): HTMLElement {
  const footerElement = footer({ className: styles.footer });

  const schoolLink = a({
    textContent: EXTERNAL_LINK.SCHOOL.TEXT,
    href: EXTERNAL_LINK.SCHOOL.HREF,
    target: EXTERNAL_LINK.TARGET,
  });

  const githubLink = a({
    textContent: EXTERNAL_LINK.GITHUB.TEXT,
    href: EXTERNAL_LINK.GITHUB.HREF,
    target: EXTERNAL_LINK.TARGET,
  });

  const year = span({ textContent: '2025' });

  footerElement.append(schoolLink, githubLink, year);

  return footerElement;
}
