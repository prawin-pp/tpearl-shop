<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import Symbol from './Symbol.svelte';

  export let title: string;
  export let okText = 'ตกลง';
  export let cancelText = 'ยกเลิก';
  export let maskClosable = true;
  export let onConfirm: () => void = undefined;
  export let onCancel: () => void = undefined;

  let popupElement: HTMLElement;
  let modal: Modal;

  export function show() {
    modal?.show();
  }

  export function hide() {
    modal?.hide();
  }

  export function toggle() {
    modal?.toggle();
  }

  function handleClickConfirm() {
    if (!onConfirm) return hide();
    onConfirm();
  }

  function handleClickCancel() {
    if (!onCancel) return hide();
    onCancel();
  }

  function handleClickMaskCloseModal() {
    popupElement.addEventListener('click', onClickMaskCloseModal);
  }

  function onClickMaskCloseModal(e: Event) {
    const target = e.target;
    if (target === popupElement) hide();
  }

  onMount(() => {
    modal = new Modal(popupElement);
    maskClosable && handleClickMaskCloseModal();
  });

  onDestroy(() => {
    popupElement.removeEventListener('click', onClickMaskCloseModal);
  });
</script>

<div
  bind:this={popupElement}
  id="popup-modal"
  tabindex="-1"
  aria-hidden="true"
  class="fixed top-0 right-0 left-0 z-50 hidden h-modal overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
>
  <div class="relative h-full w-full max-w-md p-4 md:h-auto">
    <div class="relative rounded-lg bg-white shadow">
      <button
        type="button"
        class="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
        data-modal-toggle="popup-modal"
        on:click={handleClickCancel}
      >
        <Icon class="text-[24px]">clear</Icon>
      </button>
      <div class="p-6 text-center">
        <Symbol class="mx-auto mb-4 text-[56px] text-gray-500">info</Symbol>
        <h3 class="mb-5 text-lg text-black">
          {title || ''}
        </h3>
        <button
          data-modal-toggle="popup-modal"
          type="button"
          class="mr-2 inline-flex items-center rounded-lg bg-rose-600 px-5 py-2.5 text-center text-white hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
          on:click={handleClickConfirm}
        >
          {okText || ''}
        </button>
        <button
          data-modal-toggle="popup-modal"
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
          on:click={handleClickCancel}
        >
          {cancelText || ''}
        </button>
      </div>
    </div>
  </div>
</div>
