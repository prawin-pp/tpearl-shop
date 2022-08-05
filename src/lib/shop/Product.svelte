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
  class={`flex min-w-[250px] select-none flex-col gap-y-2 overflow-hidden rounded-xl bg-white p-3  ${
    classes || ''
  }`}
  on:click
>
  <span class="overflow-hidden text-ellipsis whitespace-nowrap text-xl">
    {product.name}
  </span>
  <div class="flex">
    {#if price}
      <span
        class:text-black={price.paymentChannel.name === 'CASH'}
        class:text-grab={price.paymentChannel.name === 'GRAB'}
        class:text-lineman={price.paymentChannel.name === 'LINEMAN'}
        class:text-robinhood={price.paymentChannel.name === 'ROBINHOOD'}
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
      {:else}
        <ImageSkeleton class="h-16 w-16" />
      {/if}
    </div>
  </div>
</div>
