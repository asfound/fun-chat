import type { ServerRequest } from '../types/interfaces';

import { SERVER_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import { updateUserStatus } from '../store/actions';

export function handleServerRequest(request: ServerRequest): void {
  switch (request.type) {
    case SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGIN:
    case SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGOUT: {
      const data = request.payload;

      store.dispatch(updateUserStatus(data.user));
      break;
    }
  }
}
