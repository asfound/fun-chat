import { createButton } from '~/app/components/button/button';
import { createAuthForm } from '~/app/components/form/form';
import { BUTTON_TEXT } from '~/app/constants/constants';
import { Route } from '~/app/router/route';
import { navigate } from '~/app/router/router';
import { div } from '~/app/utils/create-element';

import styles from './login-page.module.css';

export function createLoginPage(): HTMLDivElement {
  const wrapper = div({ className: styles.wrapper });

  const form = createAuthForm();

  const aboutButton = createButton({
    textContent: BUTTON_TEXT.ABOUT,
    onClick: () => {
      navigate(Route.ABOUT);
    },
  });

  wrapper.append(form, aboutButton);

  return wrapper;
}
