import type { ComponentType } from 'svelte';
import Shop from './pages/Shop.svelte';

interface Route {
  name: string;
  path: string;
  component?: ComponentType;
  redirect?: string;
}

const routes: Route[] = [
  {
    name: 'home',
    path: '/',
    component: Shop,
  },
  {
    name: '*',
    path: '*',
    redirect: '/',
  },
];

export default routes;
