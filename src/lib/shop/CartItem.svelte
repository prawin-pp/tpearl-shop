<script lang="ts" context="module">
  export interface ICartItemEvent {
    'increase-quantity': ICartItem;
    'decrease-quantity': ICartItem;
  }
</script>

<script lang="ts">
  import numeral from 'numeral';
  import config from 'src/config';
  import type { ICartItem } from 'src/models/cart.model';
  import type { TPaymentChannel } from 'src/models/price.model';
  import { currencyText } from 'src/utils/currency';
  import { createEventDispatcher } from 'svelte';
  import Icon from '../common/Icon.svelte';
  import ImageSkeleton from '../common/ImageSkeleton.svelte';

  const dispatch = createEventDispatcher<ICartItemEvent>();

  let className = '';
  let totalAmount = 0;

  export let item: ICartItem;
  export let paymentChannel: TPaymentChannel;
  export { className as class };

  $: {
    const { price } = item.product.prices.find(
      (price) => price.paymentChannel.name === paymentChannel
    );
    const addonsAmount = item.addons.reduce((value, addon) => {
      const price = addon.product.prices.find(
        (price) => price.paymentChannel.name === paymentChannel
      );
      return value + price.price * addon.quantity;
    }, 0);

    totalAmount = numeral(price).add(addonsAmount).multiply(item.quantity).value();
  }
</script>

<div class="grid grid-cols-[96px_1fr] gap-x-4 p-4 {className || ''}">
  <div class="h-24 w-24 overflow-hidden rounded-xl bg-white">
    {#if item.product.image}
      <img
        src={config.apiBaseUrl + item.product.image.attributes.formats.small.url}
        alt={item.product.image.attributes.alternativeText}
      />
    {:else}
      <ImageSkeleton class="flex h-24 w-24" />
    {/if}
  </div>
  <div class="grid grid-flow-row auto-rows-min gap-y-1">
    <span class="line-clamp-2">
      {item.product.name}
    </span>
    <span class="text-gray-500">- หวาน {item.sweetness}%</span>
    {#if item.addons.length > 0}
      <div class="flex flex-col gap-y-1">
        {#each item.addons as addon}
          <span class="text-gray-500">
            - {addon.product.name}
            {#if addon.quantity > 1}
              x {addon.quantity}
            {/if}
          </span>
        {/each}
      </div>
    {/if}
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
