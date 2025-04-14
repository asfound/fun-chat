import type { Store } from '~/app/types/interfaces';

const REOPEN_INTERVAL = 3000;

export class WebSocketClient {
  private socket: WebSocket | null = null;

  private readonly store: Store;

  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private readonly url: string;

  constructor(url: string, store: Store) {
    this.url = url;
    this.store = store;
  }

  public open(): void {
    if (!this.store.getState().isWebsocketOpen) {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener('open', () => {
        console.log('open');
        if (this.retryTimeoutId !== null) {
          clearTimeout(this.retryTimeoutId);
        }
      });

      this.socket.addEventListener('error', () => {
        this.reopen();
      });
    }
  }

  private reopen(): void {
    this.retryTimeoutId = setTimeout(() => {
      this.open();
    }, REOPEN_INTERVAL);
  }
}
