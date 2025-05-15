import type { INPUT_TYPE, INPUT_NAME } from '~/app/constants/constants';
import type { InputValidator } from '~/app/types/types';

import { div, input, label } from '~/app/utils/create-element';

import styles from './input.module.css';

export interface InputProperties {
  type: (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];
  name: (typeof INPUT_NAME)[keyof typeof INPUT_NAME];
  placeholder: string;
  validator: (value: string) => string | null;
}

export function createInput(properties: InputProperties): {
  container: HTMLElement;
  input: HTMLInputElement;
} {
  const container = div({ className: styles.container });

  const { type, name, placeholder, validator } = properties;

  const inputElement = input({
    type,
    name,
    placeholder,
    id: name,
    required: true,
    className: styles.input,
  });

  const nameLabel = label({ htmlFor: name, className: styles.message });

  inputElement.addEventListener('input', () => {
    validateInput(inputElement, nameLabel, validator);
  });

  container.append(inputElement, nameLabel);

  return { container, input: inputElement };
}

function showError(
  inputElement: HTMLInputElement,
  labelElement: HTMLLabelElement,
  message: string | null
): void {
  labelElement.textContent = message ?? '';

  if (message) {
    inputElement.classList.add(styles.error);
    labelElement.classList.add(styles.visible);
  } else {
    inputElement.classList.remove(styles.error);
    labelElement.classList.remove(styles.visible);
  }
}

function validateInput(
  inputElement: HTMLInputElement,
  labelElement: HTMLLabelElement,
  validator: InputValidator
): void {
  const errorMessage = validator(inputElement.value);

  showError(inputElement, labelElement, errorMessage);
}
