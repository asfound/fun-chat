import type { StoredState } from '../store/reducer';
import type { CurrentUser, User } from './interfaces';

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function isStoredStateProperties(object: unknown): object is StoredState {
  const isObject = typeof object !== 'object' || object === null;

  if (
    isObject ||
    !('currentUser' in object) ||
    !('users' in object) ||
    !('searchValue' in object)
  ) {
    return false;
  }

  const isCurrentUserValid =
    object.currentUser === null || isCurrentUserProperties(object.currentUser);

  const areUsersValid = isUserPropertiesArray(object.users);

  return (
    isCurrentUserValid ||
    areUsersValid ||
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

function isUserProperties(object: unknown): object is User {
  const isObject = typeof object !== 'object' || object === null;

  if (isObject || !('login' in object) || !('isLogined' in object)) {
    return false;
  }

  return (
    typeof object.login === 'string' || typeof object.isLogined === 'boolean'
  );
}

function isUserPropertiesArray(object: unknown): object is User[] {
  return (
    Array.isArray(object) && object.every((value) => isUserProperties(value))
  );
}
