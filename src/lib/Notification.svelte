<script lang="ts">
  import { notifications } from 'src/stores/notification.store';
  import Toast from './common/Toast.svelte';
</script>

<div class="absolute top-5 left-1/2 -translate-x-1/2 transform">
  <div class="flex flex-col gap-y-4">
    {#each $notifications as notification}
      <Toast type={notification.type} title={notification.title} message={notification.message} />
    {/each}
  </div>
</div>
