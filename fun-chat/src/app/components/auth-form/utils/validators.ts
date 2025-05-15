import { LOGIN_LENGTH, PASSWORD_LENGTH, VALIDATION_ERROR_TEXT } from '~/app/constants/constants';

export function validateLogin(value: string): string | null {
  if (value.length < LOGIN_LENGTH.MIN) {
    return VALIDATION_ERROR_TEXT.MIN_LOGIN;
  }

  if (value.length > LOGIN_LENGTH.MAX) {
    return VALIDATION_ERROR_TEXT.MAX_LOGIN;
  }

  if (/[^\dA-Za-z]/.test(value)) {
    return VALIDATION_ERROR_TEXT.NO_SPECIAL_CHARACTERS;
  }

  return null;
}

export function validatePassword(value: string): string | null {
  let errorMessage: string | null = null;

  if (value.length < PASSWORD_LENGTH.MIN) {
    errorMessage = VALIDATION_ERROR_TEXT.MIN_PASSWORD;
  }

  if (!/[A-Z]/.test(value)) {
    const secondaryMessage = VALIDATION_ERROR_TEXT.USE_CAPITAL_LETTER;
    errorMessage = errorMessage ? errorMessage + secondaryMessage : secondaryMessage;
  }

  return errorMessage;
}
