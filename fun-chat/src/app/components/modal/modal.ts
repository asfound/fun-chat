import { EMPTY_STRING } from '~/app/constants/constants';
import { dialog } from '~/app/utils/create-element';

import { createButton } from '../button/button';
import styles from './modal.module.css';

const MODAL_TIMEOUT = 3000;

function createModal(content: string): HTMLDialogElement {
  const modalWindow = dialog({ className: styles.modal }, [content]);

  const closeModal = (): void => {
    modalWindow.close();
    modalWindow.remove();
  };

  setTimeout(() => {
    closeModal();
  }, MODAL_TIMEOUT);

  modalWindow.addEventListener('click', (event) => {
    if (event.target === modalWindow) {
      closeModal();
    }
  });

  const closeButton = createButton({
    textContent: EMPTY_STRING,
    className: styles.button,
  });

  closeButton.addEventListener('click', closeModal);

  modalWindow.append(closeButton, content);

  return modalWindow;
}

export function showModal(content: string): void {
  const modalWindow = createModal(content);

  document.body.prepend(modalWindow);

  modalWindow.showModal();
}
