<script lang="ts">
  import type { ICategory } from 'src/models/category.model';

  import type { IPaymentChannel, TPaymentChannel } from 'src/models/price.model';

  import type { IProduct } from 'src/models/product.model';
  import { createEventDispatcher } from 'svelte';
  import Product from './Product.svelte';

  const dispatch = createEventDispatcher();

  export let products: IProduct[] = [];
  export let categories: ICategory[] = [];
  export let paymentChannel: TPaymentChannel;

  let filteredProducts: IProduct[] = [];

  $: {
    filteredProducts = products
      .filter((product) =>
        product.prices?.find((price) => price.paymentChannel.name === paymentChannel)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }
</script>

<div class="flex h-full flex-col gap-y-10 overflow-y-auto overflow-x-hidden p-5">
  {#each categories as category}
    {#if filteredProducts.some((product) => product.category?.name === category.name)}
      <section id="section-category-{category.id}" class="flex flex-col gap-y-2.5">
        <span class="mb-2.5 text-xl font-bold text-gray-700">
          {category.name || 'อื่นๆ (Other)'}
        </span>
        <div class="-ml-5 flex flex-wrap gap-5 pl-5 pb-3">
          {#each filteredProducts as product}
            {#if product.category?.name === category.name}
              {#if product.prices.find((price) => price.paymentChannel.name === paymentChannel).price > 0}
                <Product
                  product={product}
                  paymentChannel={paymentChannel}
                  class="transition-all hover:cursor-pointer hover:shadow-md"
                  on:click={() => dispatch('select-product', product)}
                />
              {:else}
                <Product product={product} paymentChannel={paymentChannel} />
              {/if}
            {/if}
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
