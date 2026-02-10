import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

/**
 * Always initialize to 'dark' so server and client render the same (no hydration mismatch).
 * ThemeToggle syncs to the real theme (localStorage/system) in onMount.
 */
export const theme = writable<Theme>('dark');
