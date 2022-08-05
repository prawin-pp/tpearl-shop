import type { ComponentType } from 'svelte';
import Login from './pages/Login.svelte';
import Shop from './pages/Shop.svelte';

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
    name: '*',
    path: '*',
    redirect: '/shop',
  },
];

export default routes;
