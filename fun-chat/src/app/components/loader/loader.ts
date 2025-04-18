import type { State } from '~/app/store/reducer';

import type { Store } from '../../lib/store/store';

import { ACTION } from '../../store/actions';
import { div, p } from '../../utils/create-element';
import styles from './loader.module.css';

export function createLoader(store: Store<State>): void {
  const loaderElement = div({ className: styles.loader });

  const spinnerElement = div({
    className: styles.spinner,
  });

  const message = p({ textContent: 'Reconnecting...' });

  loaderElement.append(spinnerElement, message);

  const showLoader = (): void => {
    document.body.append(loaderElement);
  };

  const removeLoader = (): void => {
    loaderElement.remove();
  };

  store.subscribe(ACTION.SET_SOCKET_STATE, ({ isWebsocketOpen }) => {
    if (isWebsocketOpen) {
      removeLoader();
    } else {
      showLoader();
    }
  });
}
