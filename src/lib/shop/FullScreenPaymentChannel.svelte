<script lang="ts" context="module">
  import type { TPaymentChannel } from 'src/models/price.model';
  import { paymentChannelText } from 'src/utils/paymentChannel';

  export interface IFullScreenPaymentChannelEvent {
    'select-payment-channel': TPaymentChannel;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../common/Icon.svelte';

  const dispatch = createEventDispatcher<IFullScreenPaymentChannelEvent>();

  export let visible = false;

  export function show() {
    visible = true;
  }

  export function hide() {
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed inset-0 flex select-none flex-col items-center justify-center bg-gray-100">
    <div
      class="absolute right-5 top-5 cursor-pointer rounded-xl p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
      on:click={hide}
    >
      <Icon class="text-[48px]">clear</Icon>
    </div>
    <div class="w-full overflow-auto">
      <div
        class="cursor-pointer rounded-xl p-4 text-center text-[48px] text-cash hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'CASH')}
      >
        {paymentChannelText.CASH}
      </div>
      <div
        class="cursor-pointer rounded-xl p-4 text-center text-[48px] text-promptpay hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'PROMPTPAY')}
      >
        {paymentChannelText.PROMPTPAY}
      </div>
      <div
        class="cursor-pointer rounded-xl p-4 text-center text-[48px] text-grab hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'GRAB')}
      >
        {paymentChannelText.GRAB}
      </div>
      <div
        class="cursor-pointer rounded-xl p-4 text-center text-[48px] text-lineman hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'LINEMAN')}
      >
        {paymentChannelText.LINEMAN}
      </div>
      <div
        class="cursor-pointer rounded-xl p-4 text-center text-[48px] text-robinhood hover:animate-pulse"
        on:click={() => dispatch('select-payment-channel', 'ROBINHOOD')}
      >
        {paymentChannelText.ROBINHOOD}
      </div>
    </div>
  </div>
{/if}
