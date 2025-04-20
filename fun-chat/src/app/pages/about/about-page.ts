import { createButton } from '~/app/components/button/button';
import {
  ABOUT_TEXT,
  BUTTON_TEXT,
  EXTERNAL_LINK,
} from '~/app/constants/constants';
import { a, div, p } from '~/app/utils/create-element';

import styles from './about-page.module.css';

export function createAboutPage(): HTMLDivElement {
  const container = div({ className: styles.container });

  const aboutText = p({ textContent: ABOUT_TEXT });

  const githubLink = a({
    textContent: EXTERNAL_LINK.GITHUB.TEXT,
    href: EXTERNAL_LINK.GITHUB.HREF,
    target: EXTERNAL_LINK.TARGET,
    className: styles.link,
  });

  const returnButton = createButton({ textContent: BUTTON_TEXT.RETURN });

  container.append(aboutText, githubLink, returnButton);

  return container;
}
