export const BASE_URL = 'http://127.0.0.1:4000';

export const BUTTON_TYPE = {
  BUTTON: 'button',
  SUBMIT: 'submit',
} as const;

export const LOGIN_LENGTH = {
  MIN: 4,
  MAX: 12,
} as const;

export const PASSWORD_LENGTH = {
  MIN: 6,
} as const;

export const VALIDATION_ERROR = {
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
};

export const PLACEHOLDER = {
  LOGIN: 'Enter name',
  PASSWORD: 'Enter password',
};

export const LEGEND_TEXT = 'Login to start chatting';
