import type {
  ClientRequest,
  CurrentUser,
  LoginRequestPayload,
  LoginResponsePayload,
} from '~/app/types/interfaces';

import {
  BUTTON_TYPE,
  INPUT_NAME,
  INPUT_TYPE,
  LEGEND_TEXT,
  PLACEHOLDER,
  CLIENT_REQUEST_TYPE,
} from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { getWebSocketClient } from '~/app/services/websocket/websocket-client';
import { changeCurrentUser } from '~/app/store/actions';
import { fieldset, form, legend } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import styles from './form.module.css';
import { createInput } from './input/input';
import { validateLogin, validatePassword } from './utils/validators';

export function createAuthForm(): HTMLFormElement {
  const formElement = form({ className: styles.form });

  const fieldsetElement = fieldset({ className: styles.fieldset });

  const fieldsetLegend = legend({
    textContent: LEGEND_TEXT,
  });
  fieldsetElement.append(fieldsetLegend);

  const { container: nameContainer, input: loginInput } = createInput(
    INPUT_TYPE.TEXT,
    INPUT_NAME.LOGIN,
    PLACEHOLDER.LOGIN,
    validateLogin
  );

  const { container: passwordContainer, input: passwordInput } = createInput(
    INPUT_TYPE.PASSWORD,
    INPUT_NAME.PASSWORD,
    PLACEHOLDER.PASSWORD,
    validatePassword
  );

  const submitButton = createButton({
    textContent: 'Start',
    type: BUTTON_TYPE.SUBMIT,
    disabled: true,
    onClick: (event) => {
      event?.preventDefault();
      submitForm(loginInput, passwordInput);
    },
  });

  const validateForm = (): void => {
    const loginError = validateLogin(loginInput.value);
    const passwordError = validatePassword(passwordInput.value);

    const isValid = !loginError && !passwordError;
    submitButton.disabled = !isValid;
  };

  loginInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  fieldsetElement.append(nameContainer, passwordContainer);

  formElement.append(fieldsetElement, submitButton);

  return formElement;
}

function submitForm(
  loginInput: HTMLInputElement,
  passwordInput: HTMLInputElement
): void {
  const client = getWebSocketClient();

  const id = crypto.randomUUID();

  const payload: LoginRequestPayload = {
    user: {
      login: loginInput.value,
      password: passwordInput.value,
    },
  };

  const request: ClientRequest = {
    id,
    payload,
    type: CLIENT_REQUEST_TYPE.USER_LOGIN,
  };

  client
    .sendRequest<LoginResponsePayload>(request)
    .then((response) => {
      const userData: CurrentUser = {
        login: response.user.login,
        password: passwordInput.value,
      };

      store.dispatch(changeCurrentUser(userData));
    })
    .catch((error: unknown) => {
      console.log(error);
    });
}
