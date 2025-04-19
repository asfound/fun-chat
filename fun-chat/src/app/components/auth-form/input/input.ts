import type { InputValidator } from '~/app/types/types';

import { div, input, label } from '~/app/utils/create-element';

import styles from './input.module.css';

export function createInput(
  type: string,
  name: string,
  placeholder: string,
  validator: InputValidator
): { container: HTMLElement; input: HTMLInputElement } {
  const container = div({ className: styles.container });

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
