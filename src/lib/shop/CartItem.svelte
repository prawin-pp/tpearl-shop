<script lang="ts" context="module">
  import type { IProduct } from 'src/models/product.model';

  export interface ICartItem {
    product: IProduct;
    quantity: number;
  }

  export interface ICartItemEvent {
    'increase-quantity': ICartItem;
    'decrease-quantity': ICartItem;
  }
</script>

<script lang="ts">
  import numeral from 'numeral';
  import { createEventDispatcher } from 'svelte';
  import type { TPaymentChannel } from 'src/models/price.model';
  import Icon from '../common/Icon.svelte';
  import { currencyText } from 'src/utils/currency';
  import config from 'src/config';

  const dispatch = createEventDispatcher<ICartItemEvent>();

  export let item: ICartItem;
  export let paymentChannel: TPaymentChannel = 'CASH';
  export { classes as class };

  let classes = '';
  let totalAmount = 0;
  $: {
    const priceByPaymentChannel = item.product.prices.find(
      (price) => price.paymentChannel.name === paymentChannel
    );
    totalAmount = numeral(priceByPaymentChannel?.price || 0)
      .multiply(item.quantity)
      .value();
  }
</script>

<div class="grid grid-cols-[96px_1fr] gap-x-4 p-4 {classes || ''}">
  <div class="h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white">
    {#if item.product.image}
      <img
        src={config.apiBaseUrl + item.product.image.attributes.formats.small.url}
        alt={item.product.image.attributes.alternativeText}
      />
    {/if}
  </div>
  <div class="grid grid-flow-row auto-rows-min gap-y-1">
    <span class="line-clamp-2">{item.product.name}</span>
    <span class="font-bold text-rose-600">{currencyText(totalAmount)}</span>
    <div class="flex items-center gap-4">
      <Icon
        class="cursor-pointer rounded-xl bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300"
        on:click={() => dispatch('decrease-quantity', item)}
      >
        remove
      </Icon>
      <span>{item.quantity}</span>
      <Icon
        class="cursor-pointer rounded-xl bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300"
        on:click={() => dispatch('increase-quantity', item)}
      >
        add
      </Icon>
    </div>
  </div>
</div>
