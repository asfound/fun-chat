import type { StoredState } from '../store/reducer';
import type { CurrentUser, ErrorResponsePayload } from './interfaces';

import { ERROR_TEXT } from '../constants/constants';

function isStoredStateProperties(object: unknown): object is StoredState {
  const isObject = typeof object !== 'object' || object === null;

  if (isObject || !('currentUser' in object) || !('searchValue' in object)) {
    return false;
  }

  const isCurrentUserValid =
    object.currentUser === null || isCurrentUserProperties(object.currentUser);

  return isCurrentUserValid || typeof object.searchValue === 'string';
}

function isCurrentUserProperties(object: unknown): object is CurrentUser {
  const isObject = typeof object !== 'object' || object === null;

  if (isObject || !('login' in object) || !('password' in object)) {
    return false;
  }

  return typeof object.login === 'string' || typeof object.password === 'string';
}

export function assertIsStoredStateProperties(object: unknown): asserts object is StoredState {
  if (!isStoredStateProperties(object)) {
    throw new TypeError(ERROR_TEXT.INVALID_STATE);
  }
}

function isErrorResponsePayload(object: unknown): object is ErrorResponsePayload {
  const isObject = typeof object !== 'object' || object === null;

  if (isObject || !('error' in object)) {
    return false;
  }

  return typeof object.error === 'string';
}

export function assertErrorResponsePayload(
  object: unknown
): asserts object is ErrorResponsePayload {
  if (!isErrorResponsePayload(object)) {
    throw new TypeError(ERROR_TEXT.UNKNOWN_PAYLOAD);
  }
}
