import { notifications } from 'src/stores/notification.store';

export const ToastController = {
  info: (title: string, message: string, timeout?: number) => {
    notifications.push({ title, message, timeout, type: 'info' });
  },
  success: (title: string, message: string, timeout?: number) => {
    notifications.push({ title, message, timeout, type: 'success' });
  },
  warning: (title: string, message: string, timeout?: number) => {
    notifications.push({ title, message, timeout, type: 'warning' });
  },
  danger: (title: string, message: string, timeout?: number) => {
    notifications.push({ title, message, timeout, type: 'danger' });
  },
};
