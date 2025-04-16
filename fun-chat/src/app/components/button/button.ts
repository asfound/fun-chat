import type { ButtonProperties } from '~/app/types/interfaces';

import { BUTTON_TYPE } from '~/app/constants/constants';
import { button } from '~/app/utils/create-element';

import styles from './button.module.css';

export const createButton = (
  properties: ButtonProperties
): HTMLButtonElement => {
  const {
    textContent,
    type = BUTTON_TYPE.BUTTON,
    className,
    onClick,
    disabled = false,
  } = properties;

  const buttonElement = button({
    className: styles.button,
    textContent,
    type,
  });

  if (className) {
    buttonElement.classList.add(className);
  }

  if (onClick) {
    buttonElement.addEventListener('click', onClick);
  }

  if (disabled) {
    buttonElement.disabled = true;
  }

  return buttonElement;
};
