<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  let modalElement: HTMLElement;
  let modal: Modal;

  export let title: string;

  export function show() {
    modal?.show();
  }

  export function hide() {
    modal?.hide();
  }

  export function toggle() {
    modal?.toggle();
  }
  function handleClickCancel() {
    modal?.hide();
  }

  onMount(() => {
    modal = new Modal(modalElement);
    modal.hide();
  });
</script>

<div
  bind:this={modalElement}
  id="modal"
  tabindex="-1"
  aria-hidden="true"
  class="fixed top-0 right-0 left-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
>
  <div class="relative h-full w-full max-w-2xl p-4 md:h-auto">
    <!-- Modal content -->
    <div class="relative rounded-lg bg-white shadow">
      <!-- Modal header -->
      <div class="flex items-center justify-between rounded-t border-b p-4">
        <h3 class="text-xl font-semibold text-gray-900">{title || ''}</h3>
        <button
          type="button"
          class="absolml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
          data-modal-toggle="popup-modal"
          on:click={handleClickCancel}
        >
          <Icon class="text-[24px]">clear</Icon>
        </button>
      </div>
      <!-- Modal body -->
      <div class="space-y-6 p-6">
        <slot name="body" />
      </div>
      <!-- Modal footer -->
      {#if $$slots.footer}
        <div class="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
</div>
