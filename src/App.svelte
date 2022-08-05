<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';
  import router from 'page';

  import routes from 'src/routes';
  import Loading from 'src/lib/Loading.svelte';
  import Notification from './lib/Notification.svelte';
  import { user } from 'src/stores/user.store';
  import api from './services/api';

  let page: ComponentType;
  let params: Record<string, string>;
  let location: PageJS.Context;

  function setupRouter() {
    routes.forEach((route) => {
      router(route.path, (ctx, next) => {
        if (route.redirect) {
          return router.redirect(route.redirect);
        }
        if (route.auth && !$user) {
          return router.redirect('/login');
        } else if (!route.auth && $user) {
          return router.redirect('/');
        }
        page = route.component;
        params = ctx.params;
        location = ctx;
      });
    });
    router.start();
  }

  async function fetchUser() {
    const token = localStorage.getItem('tpearl:auth:token');
    if (!token) return;
    const me = await api.auth.getMe();
    user.set(me);
  }

  onMount(async () => {
    await fetchUser();
    setupRouter();
  });
</script>

<header />
<nav />
<main class="h-full w-full">
  <svelte:component this={page} params={params} location={location} />
</main>
<footer />

<Loading />
<Notification />
