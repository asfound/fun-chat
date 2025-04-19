import { BUTTON_TYPE, EMPTY_STRING } from '~/app/constants/constants';
import { sendMessage } from '~/app/services/message-service';
import { form, textarea } from '~/app/utils/create-element';

import { createButton } from '../../button/button';
import styles from './message-form.module.css';

export function createMessageForm(partnerLogin?: string): HTMLFormElement {
  const messageForm = form({ className: styles.form });

  const isDisabled = partnerLogin === undefined;
  const textField = textarea({
    className: styles.textInput,
    disabled: isDisabled,
  });

  const sendButton = createButton({
    textContent: 'Send',
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
          console.log(error);
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

  return messageForm;
}
