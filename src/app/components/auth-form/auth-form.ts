import {
  BUTTON_TYPE,
  INPUT_NAME,
  INPUT_TYPE,
  LEGEND_TEXT,
  PLACEHOLDER,
} from '~/app/constants/constants';
import { Route } from '~/app/router/route';
import { navigate } from '~/app/router/router';
import { authorizeUser } from '~/app/services/user-service/user-service';
import { assertErrorResponsePayload } from '~/app/types/guards';
import { fieldset, form, legend } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import { showModal } from '../modal/modal';
import styles from './auth-form.module.css';
import { createInput } from './input/input';
import { validateLogin, validatePassword } from './utils/validators';

const LOGIN_INPUT_PROPERTIES = {
  type: INPUT_TYPE.TEXT,
  name: INPUT_NAME.LOGIN,
  placeholder: PLACEHOLDER.LOGIN,
  validator: validateLogin,
};

const PASSWORD_INPUT_PROPERTIES = {
  type: INPUT_TYPE.PASSWORD,
  name: INPUT_NAME.PASSWORD,
  placeholder: PLACEHOLDER.PASSWORD,
  validator: validatePassword,
};

export function createAuthForm(): HTMLFormElement {
  const formElement = form({ className: styles.form });
  const fieldsetElement = fieldset({ className: styles.fieldset });
  const fieldsetLegend = legend({ textContent: LEGEND_TEXT });
  fieldsetElement.append(fieldsetLegend);

  const { container: nameContainer, input: loginInput } = createInput(LOGIN_INPUT_PROPERTIES);

  const { container: passwordContainer, input: passwordInput } =
    createInput(PASSWORD_INPUT_PROPERTIES);

  const submitButton = createButton({
    textContent: 'Start',
    type: BUTTON_TYPE.SUBMIT,
    disabled: true,
    onClick: (event) => {
      event?.preventDefault();
      authorizeUser(loginInput.value, passwordInput.value)
        .then(() => {
          navigate(Route.CHAT);
        })
        .catch((error: unknown) => {
          assertErrorResponsePayload(error);
          showModal(error.error);
        });
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
