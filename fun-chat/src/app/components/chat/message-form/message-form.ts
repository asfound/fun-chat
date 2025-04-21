import type { Render } from '~/app/types/types';

import {
  BUTTON_TEXT,
  BUTTON_TYPE,
  EMPTY_STRING,
} from '~/app/constants/constants';
import { store } from '~/app/lib/store/store';
import { sendMessage } from '~/app/services/message-service';
import { ACTION } from '~/app/store/actions';
import { assertErrorResponsePayload } from '~/app/types/guards';
import { form, textarea } from '~/app/utils/create-element';

import { createButton } from '../../button/button';
import { showModal } from '../../modal/modal';
import styles from './message-form.module.css';

export function createMessageForm(): HTMLFormElement {
  const messageForm = form({ className: styles.form });

  const render: Render = ({ currentChat }) => {
    messageForm.replaceChildren();

    const partnerLogin = currentChat?.userLogin;

    const isDisabled = partnerLogin === undefined;
    const textField = textarea({
      className: styles.textInput,
      disabled: isDisabled,
    });

    const sendButton = createButton({
      textContent: BUTTON_TEXT.SEND,
      type: BUTTON_TYPE.SUBMIT,
      disabled: isDisabled || textField.value === EMPTY_STRING,
    });

    const validateMessage = (): void => {
      sendButton.disabled = textField.value === EMPTY_STRING;
    };

    if (partnerLogin) {
      sendButton.addEventListener('click', (event) => {
        event.preventDefault();
        sendMessage(partnerLogin, textField.value)
          .then(() => {
            textField.value = EMPTY_STRING;
            sendButton.disabled = true;
          })
          .catch((error: unknown) => {
            assertErrorResponsePayload(error);
            showModal(error.error);
          });
      });

      textField.addEventListener('input', validateMessage);

      textField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendButton.click();
        }
      });
    }

    messageForm.append(textField, sendButton);
  };

  render(store.getState());

  store.subscribe(ACTION.SET_CURRENT_CHAT, render);

  return messageForm;
}
