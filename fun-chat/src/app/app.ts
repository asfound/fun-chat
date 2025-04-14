import { BASE_URL } from './constants/constants';
import { createLoginPage } from './pages/login/login-page';
import { Route } from './router/route';
import { initRouter } from './router/router';
import { WebSocketClient } from './services/websocket/websocket-client';
import { store } from './store/store';
import { main, section } from './utils/create-element';

export function initApp(): void {
  const mainElement = main({});

  const root = section({});

  mainElement.append(root);

  document.body.append(mainElement);

  const client = new WebSocketClient(BASE_URL, store);

  client.open();

  initRouter({
    root,
    routes: new Map([[Route.LOGIN, (): HTMLDivElement => createLoginPage()]]),
  });
}
