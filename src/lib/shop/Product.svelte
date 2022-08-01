<script lang="ts">
  import type { IProduct } from 'src/models/product.model';
  import Tooltip from '../common/Tooltip.svelte';

  export { classes as class };
  export let product: IProduct;

  let classes: string;
</script>

<div
  id={`product-${product.id}`}
  class={`flex min-w-[240px] select-none flex-col gap-y-2 overflow-hidden rounded-xl bg-white p-3  ${
    classes || ''
  }`}
  on:click
>
  <div
    class="flex aspect-1 items-center justify-center overflow-hidden rounded border border-gray-200"
  >
    <!-- {#if product.attributes.image}
      <img
        src={`${config.apiBaseUrl}${product.image.formats.small.url}`}
        alt={product.image.alternativeText}
        class="h-full w-full object-contain"
      />
    {/if} -->
  </div>
  <div class="mt-auto flex flex-col">
    <span class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
      {product.name}
    </span>
    <div class="flex gap-x-1">
      {#each product.prices as price, i}
        {#if price.paymentChannel.name !== 'PROMPTPAY'}
          <Tooltip content={price.paymentChannel.name}>
            <span
              class:text-black={price.paymentChannel.name === 'CASH'}
              class:text-grab={price.paymentChannel.name === 'GRAB'}
              class:text-lineman={price.paymentChannel.name === 'LINEMAN'}
              class:text-robinhood={price.paymentChannel.name === 'ROBINHOOD'}
            >
              {price.price}
            </span>
          </Tooltip>
          {#if i !== product.prices.length - 1}
            <span class="text-gray-300">/</span>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
</div>
