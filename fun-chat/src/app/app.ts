import { createLoader } from './components/loader/loader';
import { BASE_URL } from './constants/constants';
import { store } from './lib/store/store';
import { createLoginPage } from './pages/login/login-page';
import { Route } from './router/route';
import { initRouter } from './router/router';
import { WebSocketClient } from './services/websocket/websocket-client';
import { div } from './utils/create-element';

export function initApp(): void {
  const root = div({});

  document.body.append(root);

  const client = new WebSocketClient(BASE_URL, store);

  createLoader(store);

  client.open();

  initRouter({
    root,
    routes: new Map([[Route.LOGIN, (): HTMLDivElement => createLoginPage()]]),
  });
}
