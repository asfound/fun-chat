import { createLoginPage } from './pages/login/login-page';
import { Route } from './router/route';
import { initRouter } from './router/router';
import { main, section } from './utils/create-element';

export function initApp(): void {
  const mainElement = main({});

  const root = section({});

  mainElement.append(root);

  document.body.append(mainElement);

  initRouter({
    root,
    routes: new Map([[Route.LOGIN, (): HTMLDivElement => createLoginPage()]]),
  });
}
