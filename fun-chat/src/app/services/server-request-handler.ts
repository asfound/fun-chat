import type { ServerRequest } from '../types/interfaces';
import type { AddMessageEvent } from '../types/message-events';

import { SERVER_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import { emitChatMessageEvent, updateUserStatus } from '../store/actions';
import {
  MESSAGE_EVENT_TYPE,
  type DeliveryUpdateEvent,
} from '../types/message-events';

export function handleServerRequest(request: ServerRequest): void {
  switch (request.type) {
    case SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGIN:
    case SERVER_REQUEST_TYPE.USER_EXTERNAL_LOGOUT: {
      const data = request.payload;

      store.dispatch(updateUserStatus(data.user));
      break;
    }

    case SERVER_REQUEST_TYPE.MSG_DELIVER: {
      const data = request.payload.message;

      const event: DeliveryUpdateEvent = {
        kind: MESSAGE_EVENT_TYPE.DELIVERY_UPDATE,

        id: data.id,

        status: data.status,
      };

      store.dispatch(emitChatMessageEvent(event));
      break;
    }

    case SERVER_REQUEST_TYPE.MSG_SEND: {
      const data = request.payload.message;

      const { currentChat } = store.getState();

      if (data.from === currentChat?.userLogin) {
        const event: AddMessageEvent = {
          kind: MESSAGE_EVENT_TYPE.ADD_MESSAGE,

          message: data,
        };

        store.dispatch(emitChatMessageEvent(event));
      }

      break;
    }
  }
}
