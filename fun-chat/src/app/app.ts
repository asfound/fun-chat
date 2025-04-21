import { createLoader } from './components/loader/loader';
import { store } from './lib/store/store';
import { createAboutPage } from './pages/about/about-page';
import { createChatPage } from './pages/chat/chat-page';
import { createLoginPage } from './pages/login/login-page';
import { Route } from './router/route';
import { initRouter } from './router/router';
import { saveStateToSessionStorage } from './services/session-storage/session-storage';
import { getWebSocketClient } from './services/websocket/websocket-client';
import { div } from './utils/create-element';

export function initApp(): void {
  getWebSocketClient().open();

  const root = div({});

  document.body.append(root);

  createLoader(store);

  initRouter({
    root,
    routes: new Map([
      [Route.LOGIN, (): HTMLDivElement => createLoginPage()],
      [Route.CHAT, (): HTMLDivElement => createChatPage()],
      [Route.ABOUT, (): HTMLDivElement => createAboutPage()],
    ]),
  });

  window.addEventListener('beforeunload', () => {
    saveStateToSessionStorage(store.getState());
  });
}
