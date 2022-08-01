<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';
  import router from 'page';

  import routes from 'src/routes';
  import Loading from 'src/lib/Loading.svelte';
  import Notification from './lib/Notification.svelte';

  let page: ComponentType;
  let params: Record<string, string>;
  let location: PageJS.Context;

  function setupRouter() {
    routes.forEach((route) => {
      router(route.path, (ctx, next) => {
        page = route.component;
        params = ctx.params;
        location = ctx;
      });
    });
    router.start();
  }

  onMount(() => {
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
