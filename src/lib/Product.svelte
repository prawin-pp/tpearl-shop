<script lang="ts">
  import type { ProductModel } from 'src/models/product.model';
  import { Tooltip } from 'flowbite-svelte';
  import config from 'src/config';

  export { classes as class };
  export let product: ProductModel;

  let classes: string;
</script>

<div
  id={`product-${product.id}`}
  class={`flex min-w-[240px] select-none flex-col gap-y-2 overflow-hidden rounded-xl bg-white p-3  ${
    classes || ''
  }`}
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
      {product.attributes.name}
    </span>
    <div class="flex gap-x-1">
      {#each product.attributes.prices as price, i}
        {#if price.payment_channel.data.attributes.name !== 'PROMPTPAY'}
          <Tooltip content={price.payment_channel.data.attributes.name}>
            <span
              class:text-black={price.payment_channel.data.attributes.name === 'CASH'}
              class:text-grab={price.payment_channel.data.attributes.name === 'GRAB'}
              class:text-lineman={price.payment_channel.data.attributes.name === 'LINEMAN'}
              class:text-robinhood={price.payment_channel.data.attributes.name === 'ROBINHOOD'}
            >
              {price.price}
            </span>
            {#if i !== product.attributes.prices.length - 1}
              <span class="text-gray-300">/</span>
            {/if}
          </Tooltip>
        {/if}
      {/each}
    </div>
  </div>
</div>
