import type { State, StoredState } from '~/app/store/reducer';

import { assertIsStoredStateProperties } from '~/app/types/guards';

const STORAGE_KEY = 'as_found-fun_chat';

export function saveStateToSessionStorage(state: State): void {
  const stateToStore = convertState(state);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
}

export function loadStateFromSessionStorage(): State | null {
  const data = sessionStorage.getItem(STORAGE_KEY);

  if (data) {
    const parsedData: unknown = JSON.parse(data);
    assertIsStoredStateProperties(parsedData);

    return restoreState(parsedData);
  } else {
    return null;
  }
}

function convertState(state: State): StoredState {
  return {
    currentUser: state.currentUser,
    searchValue: state.searchValue,
  };
}

function restoreState(stored: StoredState): State {
  return {
    ...stored,
    isWebsocketOpen: false,
    users: new Map(),
    unreadMessagesCounters: new Map(),
    currentChat: null,
  };
}
