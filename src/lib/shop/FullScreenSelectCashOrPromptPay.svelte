<script lang="ts" context="module">
  import { paymentChannelText } from 'src/utils/paymentChannel';

  export interface IFullScreenSelectCashOrPromptPay {
    'select-payment-channel': 'CASH' | 'PROMPTPAY';
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../common/Icon.svelte';

  const dispatch = createEventDispatcher<IFullScreenSelectCashOrPromptPay>();

  export let visible = false;

  export function show() {
    visible = true;
  }

  export function hide() {
    visible = false;
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 z-[100] flex select-none flex-col items-center justify-center bg-gray-100"
  >
    <div
      class="absolute right-5 top-5 cursor-pointer rounded-xl p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
      on:click={hide}
    >
      <Icon class="text-[48px]">clear</Icon>
    </div>
    <div class="flex w-full flex-col items-center justify-center overflow-auto">
      <span
        class="w-min cursor-pointer whitespace-nowrap rounded-xl p-4 text-center text-[48px] text-cash hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'CASH')}
      >
        {paymentChannelText.CASH}
      </span>
      <span
        class="w-min cursor-pointer whitespace-nowrap rounded-xl p-4 text-center text-[48px] text-promptpay hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'PROMPTPAY')}
      >
        {paymentChannelText.PROMPTPAY}
      </span>
    </div>
  </div>
{/if}
