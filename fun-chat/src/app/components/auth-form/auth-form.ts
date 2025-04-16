import { BUTTON_TYPE } from '~/app/constants/constants';
import {
  fieldset,
  form,
  input,
  label,
  legend,
} from '~/app/utils/create-element';

import { createButton } from '../button/button';

export function createAuthForm(): HTMLFormElement {
  const formElement = form({});

  const fieldsetElement = fieldset({});

  const fieldsetLegend = legend({ textContent: 'Login to start chatting' });
  fieldsetElement.append(fieldsetLegend);

  const nameInput = input({
    id: 'login',
    type: 'text',
    name: 'name',
    placeholder: 'Enter name',
    required: true,
  });

  const nameLabel = label({ htmlFor: 'login' }, ['name']);

  const passwordInput = input({
    id: 'password',
    type: 'password',
    name: 'password',
    placeholder: 'Enter password',
    required: true,
  });

  const passwordLabel = label({ htmlFor: 'password' }, ['password']);

  fieldsetElement.append(nameLabel, nameInput, passwordLabel, passwordInput);

  const submitButton = createButton({
    textContent: 'Start',
    type: BUTTON_TYPE.SUBMIT,
  });

  formElement.append(fieldsetElement, submitButton);

  return formElement;
}
