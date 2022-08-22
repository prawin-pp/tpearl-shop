import { writable } from 'svelte/store';

function createLoading() {
  const { set, subscribe, update } = writable(0);
  return {
    clear: () => set(0),
    decrease: () => update((value) => value - 1),
    increase: () => update((value) => value + 1),
    subscribe,
  };
}
export const loading = createLoading();
