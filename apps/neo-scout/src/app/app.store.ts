import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type AppShellState = {
  title: string;
  ready: boolean;
};

const initialState: AppShellState = {
  title: 'NEO Scout',
  ready: true,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    markReady(): void {
      patchState(store, { ready: true });
    },
  })),
);

export type AppStore = InstanceType<typeof AppStore>;
