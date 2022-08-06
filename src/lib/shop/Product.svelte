<script lang="ts">
  import config from 'src/config';
  import type { TPaymentChannel } from 'src/models/price.model';
  import type { IProduct } from 'src/models/product.model';
  import { currencyText } from 'src/utils/currency';
  import ImageSkeleton from '../common/ImageSkeleton.svelte';
  import Tooltip from '../common/Tooltip.svelte';

  export { classes as class };
  export let product: IProduct;
  export let paymentChannel: TPaymentChannel;

  let classes: string;

  $: price = product.prices?.find((price) => price.paymentChannel.name === paymentChannel);
</script>

<div
  id={`product-${product.id}`}
  class={`flex w-[250px] select-none flex-col gap-y-2 overflow-hidden rounded-xl bg-white p-3  ${
    classes || ''
  }`}
  class:bg-gray-200={price.price === 0}
  on:click
>
  <span class="text-xl line-clamp-1" class:text-gray-500={price.price === 0}>
    {product.name}
  </span>
  <div class="mt-auto flex">
    {#if price}
      <span
        class:text-black={price.price > 0 && price.paymentChannel.name === 'CASH'}
        class:text-grab={price.price > 0 && price.paymentChannel.name === 'GRAB'}
        class:text-lineman={price.price > 0 && price.paymentChannel.name === 'LINEMAN'}
        class:text-robinhood={price.price > 0 && price.paymentChannel.name === 'ROBINHOOD'}
        class:text-gray-500={price.price === 0}
        class="inline-flex self-end text-xl"
      >
        {currencyText(price.price)}
      </span>
    {/if}
    <div class="ml-auto flex aspect-1 h-16 w-16 overflow-hidden rounded-xl">
      {#if product.image}
        <img
          src={config.apiBaseUrl + product.image.attributes.formats.thumbnail.url}
          alt={product.image.attributes.alternativeText}
          class="h-full w-full object-contain"
        />
      {:else if !product.image && price.price > 0}
        <ImageSkeleton class="h-16 w-16" />
      {/if}
    </div>
  </div>
</div>
