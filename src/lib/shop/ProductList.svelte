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
      .sort((a, b) => {
        if (a.prices[0].price < b.prices[0].price) return -1;
        else if (a.prices[0].price > b.prices[0].price) return 1;
        return a.name.localeCompare(b.name);
      });
  }
</script>

<div class="flex h-full flex-col gap-y-5 overflow-y-auto overflow-x-hidden p-5">
  {#each categories as category}
    {#if filteredProducts.some((product) => product.category?.name === category.name)}
      <section class="flex flex-col gap-y-2.5">
        <span class="text--500">{category.name || 'อื่นๆ (Other)'}</span>
        <div class="-ml-5 flex gap-x-5 overflow-auto scroll-smooth pl-5 pb-3">
          {#each filteredProducts as product}
            {#if product.category?.name === category.name}
              <Product
                product={product}
                paymentChannel={paymentChannel}
                class="transition-all hover:cursor-pointer hover:shadow-md"
                on:click={() => dispatch('select-product', product)}
              />
            {/if}
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
