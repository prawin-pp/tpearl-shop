<script lang="ts">
  import router from 'page';
  import { onMount, type ComponentType } from 'svelte';

  import Loading from 'src/lib/Loading.svelte';
  import routes from 'src/routes';
  import { user } from 'src/stores/user.store';
  import ConfirmModal from './lib/common/ConfirmModal.svelte';
  import Notification from './lib/Notification.svelte';
  import Menu from './Menu.svelte';
  import api from './services/api';

  let confirmLogoutModal: ConfirmModal;

  let page: ComponentType;
  let params: Record<string, string>;
  let location: PageJS.Context;

  function setupRouter() {
    routes.forEach((route) => {
      router(route.path, async (ctx, next) => {
        if (route.redirect) {
          return router.redirect(route.redirect);
        }

        if (route.auth && !$user) {
          return router.redirect('/login');
        } else if (!route.auth && $user) {
          return router.redirect('/');
        }

        if (route.asyncComponent) {
          const { default: component } = await route.asyncComponent(ctx);
          page = component;
        } else if (route.component) {
          page = route.component;
        }

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

  function handleRedirectTo(e: CustomEvent<string>) {
    const path = e.detail;
    router.redirect(path);
  }

  function handleOpenConfirmLogoutModal() {
    confirmLogoutModal.show();
  }

  function handleLogout() {
    confirmLogoutModal.hide();
    page = null;
    user.logout();
  }

  onMount(async () => {
    await fetchUser();
    setupRouter();
  });
</script>

{#if !$user}
  <svelte:component this={page} params={params} location={location} />
{:else}
  <div class="grid h-full w-full grid-cols-[64px_1fr] overflow-hidden">
    <Menu
      location={location}
      on:redirect={handleRedirectTo}
      on:logout={handleOpenConfirmLogoutModal}
    />
    <div class="h-full w-full overflow-hidden">
      <svelte:component this={page} params={params} location={location} />
    </div>
  </div>
{/if}

<Loading />
<Notification />

<ConfirmModal
  bind:this={confirmLogoutModal}
  title="คุณต้องการที่จะออกจากระบบใช่หรือไม่?"
  onConfirm={handleLogout}
/>
