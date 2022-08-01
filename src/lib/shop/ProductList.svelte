<script lang="ts">
  import type { IProduct } from 'src/models/product.model';
  import { createEventDispatcher } from 'svelte';
  import Product from './Product.svelte';

  const dispatch = createEventDispatcher();

  export let products: IProduct[] = [];

  $: productsSorted = products.sort((a, b) => {
    if (a.prices[0].price < b.prices[0].price) return -1;
    else if (a.prices[0].price > b.prices[0].price) return 1;
    return a.name.localeCompare(b.name);
  });

  $: categories = [
    ...products.reduce((prev, product) => {
      prev.add(product.category?.name);
      return prev;
    }, new Set<string>()),
  ].sort((a, b) => a.localeCompare(b));
</script>

<div class="flex h-full flex-col gap-y-5 overflow-y-auto overflow-x-hidden p-5">
  {#each categories as category}
    <section class="flex flex-col gap-y-2">
      <span class="text-xl font-bold">{category || 'อื่นๆ (Other)'}</span>
      <div class="-ml-5 flex gap-x-5 overflow-auto scroll-smooth pl-5 pb-3">
        {#each productsSorted as product}
          {#if product.category?.name === category}
            <Product
              product={product}
              class="transition-all hover:cursor-pointer hover:shadow-md"
              on:click={() => dispatch('select-product', product)}
            />
          {/if}
        {/each}
      </div>
    </section>
  {/each}
</div>
