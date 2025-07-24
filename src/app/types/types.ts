import type { State } from '../store/reducer';

export type InputValidator = (value: string) => string | null;

export type Render = (state: State) => void;
