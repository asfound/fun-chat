export const Route = {
  ABOUT: 'about',
  LOGIN: 'login',
  CHAT: 'chat',
} as const;

export type Route = (typeof Route)[keyof typeof Route];
