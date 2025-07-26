export const BASE_URL = 'https://rsschool.shubbush.xyz/fun-chat/';

export const APP_NAME = 'Fun Chat';
export const APP_YEAR = '2025';

export const NOTIFICATION_VAR = '--after-content';

export const BUTTON_TYPE = {
  BUTTON: 'button',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  ABOUT: 'About App',
  LOGOUT: 'Logout',

  RETURN: 'Return',
  SEND: 'Send',
} as const;

export const LOGIN_LENGTH = {
  MIN: 4,
  MAX: 12,
} as const;

export const PASSWORD_LENGTH = {
  MIN: 6,
} as const;

export const VALIDATION_ERROR_TEXT = {
  MIN_LOGIN: `Must be at least ${LOGIN_LENGTH.MIN.toString()} characters long.`,
  MAX_LOGIN: `Must be no more than ${LOGIN_LENGTH.MAX.toString()} characters long.`,
  NO_SPECIAL_CHARACTERS: 'Must contain only Latin letters and digits.',

  MIN_PASSWORD: `Must be at least ${PASSWORD_LENGTH.MIN.toString()} characters long. `,
  USE_CAPITAL_LETTER: 'Password should contain at least one capital letter.',
} as const;

export const INPUT_TYPE = {
  TEXT: 'text',
  PASSWORD: 'password',
} as const;

export const INPUT_NAME = {
  LOGIN: 'login',
  PASSWORD: 'password',
} as const;

export const PLACEHOLDER = {
  LOGIN: 'Enter name',
  NO_MESSAGES: 'No messages',
  PASSWORD: 'Enter password',
  SELECT_CHAT: 'Select chat',
  SEARCH: 'Find user...',
} as const;

export const LEGEND_TEXT = 'Login to start chatting';

export const EXTERNAL_LINK = {
  SCHOOL: { HREF: 'https://rs.school', TEXT: 'RS School' },
  GITHUB: { HREF: 'https://github.com/asfound', TEXT: 'asfound' },
  TARGET: '_blank',
} as const;

export const CLIENT_REQUEST_TYPE = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_ACTIVE: 'USER_ACTIVE',
  USER_INACTIVE: 'USER_INACTIVE',

  MSG_SEND: 'MSG_SEND',
  MSG_FROM_USER: 'MSG_FROM_USER',
  MSG_READ: 'MSG_READ',
  MSG_DELETE: 'MSG_DELETE',
  MSG_EDIT: 'MSG_EDIT',
} as const;

export const SERVER_RESPONSE_TYPE = {
  ...CLIENT_REQUEST_TYPE,
  ERROR: 'ERROR',
} as const;

export const SERVER_REQUEST_TYPE = {
  USER_EXTERNAL_LOGIN: 'USER_EXTERNAL_LOGIN',
  USER_EXTERNAL_LOGOUT: 'USER_EXTERNAL_LOGOUT',

  MSG_SEND: 'MSG_SEND',
  MSG_DELIVER: 'MSG_DELIVER',
  MSG_READ: 'MSG_READ',
  MSG_DELETE: 'MSG_DELETE',
  MSG_EDIT: 'MSG_EDIT',
} as const;

export type ClientRequestType = (typeof CLIENT_REQUEST_TYPE)[keyof typeof CLIENT_REQUEST_TYPE];

export type ServerResponseType = (typeof SERVER_RESPONSE_TYPE)[keyof typeof SERVER_RESPONSE_TYPE];

export type ServerRequestType = (typeof SERVER_REQUEST_TYPE)[keyof typeof SERVER_REQUEST_TYPE];

export const EMPTY_STRING = '';
export const EMPTY_VALUE = 0;

export const ABOUT_TEXT =
  'App development is part of the JavaScript/Front-end 2024Q4 course at Rolling Scopes School. \nAuthor:';

export const ERROR_TEXT = {
  UNKNOWN_PAYLOAD: 'Unknown payload',
  INVALID_STATE: 'Not a valid state',
  SOCKET_CLOSED: 'Socket is closed',
  REQUEST_UNKNOWN: 'Received response for unknown request',
} as const;

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export const DIVIDER_TEXT = 'Unread messages';

export const MESSAGE_STATUS_TEXT = {
  EDITED: 'Edited',
  DELIVERED: 'Delivered',
  READ: 'Read',
  SENT: 'Sent',
};

export const ICON_CODE = {
  LIB: 'fas',
  DELETE: 'fa-trash',
  DISCARD: 'fa-xmark',
  CONFIRM: 'fa-check',
  EDIT: 'fa-pen-to-square',
} as const;

export const HAS_NOTIFICATIONS = 'true';

export const USER_LABEL = 'User: ';

export const LOADER_TEXT = 'Connecting...';
