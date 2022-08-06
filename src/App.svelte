<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';
  import router from 'page';

  import routes from 'src/routes';
  import Loading from 'src/lib/Loading.svelte';
  import Notification from './lib/Notification.svelte';
  import { user } from 'src/stores/user.store';
  import api from './services/api';
  import Icon from './lib/common/Icon.svelte';

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

  function navigate(routeName: string) {
    const route = routes.find((route) => route.name === routeName);
    if (route) router.redirect(route.path);
  }

  onMount(async () => {
    await fetchUser();
    setupRouter();
  });
</script>

{#if !$user}
  <svelte:component this={page} params={params} location={location} />
{:else}
  <div class="grid h-full w-full grid-cols-[64px_1fr] overflow-hidden bg-gray-100">
    <aside class="z-10 flex h-full flex-col items-center gap-y-2 bg-white py-2 shadow-sm">
      <Icon
        class="{location?.path === '/shop'
          ? 'bg-gray-200'
          : ''} mb-5 cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
        on:click={() => navigate('shop')}
      >
        monitor
      </Icon>
      <Icon
        class="cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
        on:click={() => navigate('shop')}
      >
        payment
      </Icon>
      <Icon
        class="cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
        on:click={() => navigate('shop')}
      >
        trending_up
      </Icon>
    </aside>
    <main class="h-full w-full overflow-hidden">
      <svelte:component this={page} params={params} location={location} />
    </main>
  </div>
{/if}

<Loading />
<Notification />
