<script lang="ts">
  import type { TNotificationType } from 'src/stores/notification.store';

  import Icon from './Icon.svelte';

  export let type: TNotificationType = 'info';
  export let title = '';
  export let message = '';
</script>

<div
  class="rounded-lg border p-4"
  role="alert"
  class:border-green-300={type === 'success'}
  class:bg-green-50={type === 'success'}
  class:border-blue-300={type === 'info'}
  class:bg-blue-50={type === 'info'}
  class:border-yellow-300={type === 'warning'}
  class:bg-yellow-50={type === 'warning'}
  class:border-red-300={type === 'danger'}
  class:bg-red-50={type === 'danger'}
>
  <div class="flex items-center">
    <Icon class="pr-2 text-[20px]">info</Icon>
    <h3
      class="text-lg font-medium"
      class:text-green-700={type === 'success'}
      class:text-blue-700={type === 'info'}
      class:text-yellow-700={type === 'warning'}
      class:text-red-700={type === 'danger'}
    >
      {title}
    </h3>
  </div>
  {#if message}
    <div
      class="mt-2"
      class:text-green-700={type === 'success'}
      class:text-blue-700={type === 'info'}
      class:text-yellow-700={type === 'warning'}
      class:text-red-700={type === 'danger'}
    >
      {message}
    </div>
  {/if}
</div>
