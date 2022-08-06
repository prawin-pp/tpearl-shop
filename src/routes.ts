import type { ComponentType } from 'svelte';
import Login from './pages/Login.svelte';
import Shop from './pages/Shop.svelte';
import Transaction from './pages/Payment.svelte';
import Payment from './pages/Payment.svelte';
import Report from './pages/Report.svelte';

interface Route {
  name: string;
  path: string;
  component?: ComponentType;
  auth?: boolean;
  redirect?: string;
}

const routes: Route[] = [
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'shop',
    path: '/shop',
    component: Shop,
    auth: true,
  },
  {
    name: 'payment',
    path: '/payment',
    component: Payment,
    auth: true,
  },
  {
    name: 'report',
    path: '/report',
    component: Report,
    auth: true,
  },
  {
    name: '*',
    path: '*',
    redirect: '/shop',
  },
];

export default routes;
