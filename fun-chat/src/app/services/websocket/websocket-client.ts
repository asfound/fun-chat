import type { Store } from '~/app/lib/store/store';
import type { State } from '~/app/types/interfaces';

import { setSocketState } from '~/app/store/actions';

const REOPEN_INTERVAL = 3000;

export class WebSocketClient {
  private socket: WebSocket | null = null;

  private readonly store: Store<State>;

  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private readonly url: string;

  constructor(url: string, store: Store<State>) {
    this.url = url;
    this.store = store;
  }

  public open(): void {
    if (!this.store.getState().isWebsocketOpen) {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener(
        'open',
        () => {
          console.log('open');
          if (this.retryTimeoutId !== null) {
            clearTimeout(this.retryTimeoutId);
          }

          this.store.dispatch(setSocketState(true));
        },
        { once: true }
      );

      this.socket.addEventListener('error', () => {
        this.handleDisconnect();
      });

      this.socket.addEventListener('close', () => {
        this.handleDisconnect();
      });
    }
  }

  private reopen(): void {
    this.retryTimeoutId = setTimeout(() => {
      this.open();
    }, REOPEN_INTERVAL);
  }

  private handleDisconnect(): void {
    if (this.store.getState().isWebsocketOpen) {
      this.store.dispatch(setSocketState(false));
    }

    this.reopen();
  }
}
