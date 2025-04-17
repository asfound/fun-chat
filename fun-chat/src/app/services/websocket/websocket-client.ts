/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { State } from '~/app/store/reducer';
import type { ClientRequest, ServerMessage } from '~/app/types/interfaces';

import { BASE_URL, SERVER_RESPONSE_TYPE } from '~/app/constants/constants';
import { store, type Store } from '~/app/lib/store/store';
import { setSocketState } from '~/app/store/actions';

const REOPEN_INTERVAL = 3000;

interface PromiseToResolve<R> {
  resolve: (response: R) => void;
  reject: (reason?: any) => void;
}

export class WebSocketClient {
  private static instance: WebSocketClient | null = null;

  private webSocket: WebSocket | null = null;

  private readonly store: Store<State>;

  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private readonly url: string;

  private readonly requests = new Map<string, PromiseToResolve<any>>();

  constructor(url: string, store: Store<State>) {
    this.url = url;
    this.store = store;
  }

  public static getInstance(url: string, store: Store<State>): WebSocketClient {
    WebSocketClient.instance ??= new WebSocketClient(url, store);
    return WebSocketClient.instance;
  }

  public open(): void {
    if (!this.store.getState().isWebsocketOpen) {
      this.webSocket = new WebSocket(this.url);

      this.webSocket.addEventListener(
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

      this.webSocket.addEventListener('message', (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.handleMessage(event.data);
      });

      this.webSocket.addEventListener('error', () => {
        this.handleDisconnect();
      });

      this.webSocket.addEventListener('close', () => {
        this.handleDisconnect();
      });
    }
  }

  public sendRequest<R>(request: ClientRequest): Promise<R> {
    return this.store.getState().isWebsocketOpen && this.webSocket
      ? new Promise<R>((resolve, reject) => {
          this.requests.set(request.id, { resolve, reject });
          this.webSocket?.send(JSON.stringify(request));
        })
      : Promise.reject(new Error('socket is closed'));
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

  private handleMessage(data: string): void {
    const serverMessage = JSON.parse(data) as ServerMessage;
    if ('id' in serverMessage) {
      const promiseToResolve = this.requests.get(serverMessage.id);

      if (promiseToResolve) {
        if (
          serverMessage.type === SERVER_RESPONSE_TYPE.ERROR &&
          'error' in serverMessage.payload
        ) {
          promiseToResolve.reject(serverMessage.payload);
        } else {
          promiseToResolve.resolve(serverMessage.payload);
        }

        this.requests.delete(serverMessage.id);
      } else {
        console.error('Received response for unknown request', serverMessage);
      }
    }

    console.log(data);
  }
}

export function getWebSocketClient(): WebSocketClient {
  return WebSocketClient.getInstance(BASE_URL, store);
}
