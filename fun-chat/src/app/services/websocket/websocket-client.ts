export class WebSocketClient {
  private socket: WebSocket | null = null;

  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public open(): void {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => {
      console.log('open');
    });
  }
}
