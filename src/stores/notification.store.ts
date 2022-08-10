import { writable } from 'svelte/store';

export type TNotificationType = 'info' | 'danger' | 'success' | 'warning';

export interface INotification {
  title: string;
  message: string;
  type: TNotificationType;
  timeout?: number;
}

function createNotifications() {
  const { subscribe, set, update } = writable<INotification[]>([]);

  return {
    subscribe,
    push: (notification: INotification) => {
      update((list) => [...list, notification]);

      setTimeout(() => {
        update((list) => list.filter((item) => item !== notification));
      }, notification.timeout || 5000);
    },
    reset: () => set([]),
  };
}

export const notifications = createNotifications();
