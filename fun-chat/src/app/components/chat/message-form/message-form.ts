import { BUTTON_TYPE } from '~/app/constants/constants';
import { form, textarea } from '~/app/utils/create-element';

import { createButton } from '../../button/button';
import styles from './message-form.module.css';

export function createMessageForm(): HTMLFormElement {
  const messageForm = form({ className: styles.form });

  const textField = textarea({ className: styles.textInput });

  const sendButton = createButton({
    textContent: 'Send',
    type: BUTTON_TYPE.SUBMIT,
    disabled: true,
    onClick: (event) => {
      event?.preventDefault();
    },
  });

  messageForm.append(textField, sendButton);

  return messageForm;
}
