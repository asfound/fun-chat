import type { ServerRequest } from '../types/interfaces';
import type { EditMessageEvent } from '../types/message-events';

import { SERVER_REQUEST_TYPE } from '../constants/constants';
import { store } from '../lib/store/store';
import {
  emitChatMessageEvent,
  updateNotificationCount,
  updateUserStatus,
} from '../store/actions';
import {
  MESSAGE_EVENT_TYPE,
  type AddMessageEvent,
  type DeleteMessageEvent,
  type DeliveryUpdateEvent,
  type ReadUpdateEvent,
} from '../types/message-events';

export const DEFAULT_INCREMENT = 1;
// export const DEFAULT_DECREMENT = -1;

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
      } else {
        store.dispatch(updateNotificationCount([data.from, DEFAULT_INCREMENT]));
      }

      break;
    }

    case SERVER_REQUEST_TYPE.MSG_READ: {
      const data = request.payload.message;

      const event: ReadUpdateEvent = {
        kind: MESSAGE_EVENT_TYPE.READ_UPDATE,

        id: data.id,

        status: data.status,
      };

      store.dispatch(emitChatMessageEvent(event));
      break;
    }

    case SERVER_REQUEST_TYPE.MSG_DELETE: {
      const data = request.payload.message;

      const event: DeleteMessageEvent = {
        kind: MESSAGE_EVENT_TYPE.DELETE_MESSAGE,

        id: data.id,

        status: data.status,
      };

      store.dispatch(emitChatMessageEvent(event));
      break;
    }

    case SERVER_REQUEST_TYPE.MSG_EDIT: {
      const data = request.payload.message;

      const event: EditMessageEvent = {
        kind: MESSAGE_EVENT_TYPE.EDIT_MESSAGE,

        id: data.id,

        text: data.text,

        status: data.status,
      };

      store.dispatch(emitChatMessageEvent(event));
      break;
    }
  }
}
