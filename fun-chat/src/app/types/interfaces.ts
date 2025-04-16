// export interface State {
//   currentAppPage: Route;

//   isWebsocketOpen: boolean;
// }

// export interface Store {
//   getState: () => State;

//   updateState: (newState: Partial<State>) => void;

//   subscribe: (event: EventType, callback: EmitterCallback<State>) => void;
// }

export interface State {
  isWebsocketOpen: boolean;
  currentUser: string;
}
