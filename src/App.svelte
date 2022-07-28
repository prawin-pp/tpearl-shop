<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';
  import router from 'page';
  import routes from 'src/routes';

  let page: ComponentType;
  let params: Record<string, string>;
  let location: PageJS.Context;

  function _setupRouter() {
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
    _setupRouter();
  });
</script>

<header />
<nav />
<main class="h-full w-full">
  <svelte:component this={page} params={params} location={location} />
</main>
<footer />
