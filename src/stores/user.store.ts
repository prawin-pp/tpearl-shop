import type { IUserModel } from 'src/models/user.model';
import { writable } from 'svelte/store';

export const user = writable<IUserModel>(null);
