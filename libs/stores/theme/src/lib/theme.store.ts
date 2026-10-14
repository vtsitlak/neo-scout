import { effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'neo-scout-theme';

function readStoredTheme(): ThemeMode {
  if (typeof localStorage === 'undefined') {
    return 'light';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

function applyDomTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(STORAGE_KEY, mode);
}

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState({ mode: 'light' as ThemeMode }),
  withMethods((store) => ({
    setMode(mode: ThemeMode): void {
      patchState(store, { mode });
    },
    toggle(): void {
      patchState(store, {
        mode: store.mode() === 'dark' ? 'light' : 'dark',
      });
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, { mode: readStoredTheme() });
      effect(() => {
        applyDomTheme(store.mode());
      });
    },
  }),
);

export type ThemeStore = InstanceType<typeof ThemeStore>;
