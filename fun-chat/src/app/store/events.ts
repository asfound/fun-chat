export const EventType = {
  APP_PAGE_CHANGE: 0,
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
