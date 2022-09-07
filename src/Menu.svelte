<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Icon from './lib/common/Icon.svelte';

  const dispatch = createEventDispatcher<{ redirect: string; logout: void }>();

  export let location: PageJS.Context;

  function handleChangePath(path: string) {
    dispatch('redirect', path);
  }

  function handleLogout() {
    dispatch('logout');
  }
</script>

<div id="menu" class="flex h-full flex-col items-center gap-y-2 bg-white py-2 shadow-sm">
  <Icon
    class="{location?.path === '/shop' ? 'bg-gray-200' : ''}
    mb-5 cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
    on:click={() => handleChangePath('/shop')}
  >
    monitor
  </Icon>
  <Icon
    class="{location?.path === '/payment' ? 'bg-gray-200' : ''}
    cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
    on:click={() => handleChangePath('/payment')}
  >
    payment
  </Icon>
  <Icon
    class="{location?.path === '/report' ? 'bg-gray-200' : ''}
    cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
    on:click={() => handleChangePath('/report')}
  >
    trending_up
  </Icon>
  <Icon
    class="{location?.path === '/profit' ? 'bg-gray-200' : ''}
    cursor-pointer rounded-xl p-2 text-[24px] transition hover:bg-gray-200"
    on:click={() => handleChangePath('/profit')}
  >
    savings
  </Icon>
  <Icon
    class="mt-auto cursor-pointer rounded-xl p-2 text-[24px] text-rose-600 transition hover:bg-gray-200"
    on:click={handleLogout}
  >
    logout
  </Icon>
</div>
