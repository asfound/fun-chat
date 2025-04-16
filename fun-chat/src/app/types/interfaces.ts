export interface ButtonProperties {
  textContent: string;
  type?: HTMLButtonElement['type'];
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface State {
  isWebsocketOpen: boolean;
  currentUser: string;
}
