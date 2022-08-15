import type { Context } from 'page';
import type { ComponentType } from 'svelte';

interface Route {
  name: string;
  path: string;
  component?: ComponentType;
  asyncComponent?: (ctx: Context) => Promise<any>;
  auth?: boolean;
  redirect?: string;
}

const routes: Route[] = [
  {
    name: 'login',
    path: '/login',
    asyncComponent: (ctx: Context) => {
      return import('./pages/Login.svelte');
    },
  },
  {
    name: 'shop',
    path: '/shop',
    auth: true,
    asyncComponent: (ctx: Context) => {
      return import('./pages/Shop.svelte');
    },
  },
  {
    name: 'payment',
    path: '/payment',
    auth: true,
    asyncComponent: (ctx: Context) => {
      return import('./pages/Payment.svelte');
    },
  },
  {
    name: 'report',
    path: '/report',
    auth: true,
    asyncComponent: (ctx: Context) => {
      return import('./pages/Report.svelte');
    },
  },
  {
    name: '*',
    path: '*',
    redirect: '/shop',
  },
];

export default routes;
