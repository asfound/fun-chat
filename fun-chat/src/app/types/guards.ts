import type { StoredState } from '../store/reducer';
import type { CurrentUser } from './interfaces';

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function isStoredStateProperties(object: unknown): object is StoredState {
  const isObject = typeof object !== 'object' || object === null;

  if (
    isObject ||
    !('currentUser' in object) ||
    !('currentChat' in object) ||
    !('searchValue' in object)
  ) {
    return false;
  }

  const isCurrentUserValid =
    object.currentUser === null || isCurrentUserProperties(object.currentUser);

  const isCurrentChatValid = true;

  return (
    isCurrentUserValid ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    isCurrentChatValid ||
    typeof object.searchValue === 'string'
  );
}

function isCurrentUserProperties(object: unknown): object is CurrentUser {
  const isObject = typeof object !== 'object' || object === null;

  if (isObject || !('login' in object) || !('password' in object)) {
    return false;
  }

  return (
    typeof object.login === 'string' || typeof object.password === 'string'
  );
}

export function assertIsStoredStateProperties(
  object: unknown
): asserts object is StoredState {
  if (!isStoredStateProperties(object)) {
    throw new TypeError('not valid state');
  }
}
