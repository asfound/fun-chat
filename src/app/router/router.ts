import { EMPTY_STRING } from '../constants/constants';
import { store } from '../lib/store/store';
import { Route } from './route';

interface RouterProperties {
  root: HTMLElement;
  routes: Map<string, () => HTMLElement>;
}

export function initRouter({ root, routes }: RouterProperties): void {
  function handleHashChange(): void {
    const hash = globalThis.location.hash.replace(/#/, EMPTY_STRING);

    if (!store.getState().currentUser && hash === Route.CHAT) {
      navigate(Route.LOGIN);
    } else if (store.getState().currentUser && hash === Route.LOGIN) {
      navigate(Route.CHAT);
    } else {
      const newPage = routes.get(hash);

      if (newPage) {
        setPage(root, newPage);
      } else {
        navigate(Route.LOGIN);
      }
    }
  }

  globalThis.addEventListener('hashchange', handleHashChange);

  handleHashChange();
}

export function navigate(route: Route): void {
  globalThis.location.hash = route;
}

function setPage(root: HTMLElement, getPage: () => HTMLElement): void {
  root.replaceChildren(getPage());
}
