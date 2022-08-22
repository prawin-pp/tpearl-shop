import router from 'page';
import type { IUserModel } from 'src/models/user.model';
import { writable } from 'svelte/store';

function createUser() {
  const { set, subscribe, update } = writable<IUserModel>(null);
  return {
    logout: () => {
      set(null);
      localStorage.removeItem('tpearl:auth:token');
      router.redirect('/');
    },
    set,
    subscribe,
    update,
  };
}

export const user = createUser();
