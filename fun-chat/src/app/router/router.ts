import { Route } from './route';

interface RouterProperties {
  root: HTMLElement;
  routes: Map<string, () => HTMLElement>;
}

export function initRouter({ root, routes }: RouterProperties): void {
  function handleHashChange(): void {
    const hash = globalThis.location.hash.replace(/#/, '');

    const newPage = routes.get(hash);

    if (newPage) {
      setPage(root, newPage);
    } else {
      navigate();
    }
  }

  globalThis.addEventListener('hashchange', handleHashChange);

  handleHashChange();
}

export function navigate(route: Route = Route.LOGIN): void {
  globalThis.location.hash = route;
}

function setPage(root: HTMLElement, getPage: () => HTMLElement): void {
  root.replaceChildren(getPage());
}
