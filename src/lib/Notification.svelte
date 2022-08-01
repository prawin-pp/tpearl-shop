<script lang="ts">
  import { notifications } from 'src/stores/notification.store';
  import Toast from './common/Toast.svelte';
</script>

<div class="absolute bottom-5 left-5">
  <div class="flex max-w-[320px] flex-col gap-y-4">
    {#each $notifications as notification}
      <Toast type={notification.type} title={notification.title} message={notification.message} />
    {/each}
  </div>
</div>
