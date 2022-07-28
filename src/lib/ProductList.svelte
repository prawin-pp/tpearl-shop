<script lang="ts">
  import type { ProductModel } from 'src/models/product.model';
  import Product from './Product.svelte';

  export let products: ProductModel[] = [];

  $: productsSorted = products.sort((a, b) => {
    if (a.attributes.prices[0].price < b.attributes.prices[0].price) return -1;
    else if (a.attributes.prices[0].price > b.attributes.prices[0].price) return 1;
    return a.attributes.name.localeCompare(b.attributes.name);
  });

  $: categories = [
    ...products.reduce((prev, product) => {
      prev.add(product.attributes.category?.data?.attributes?.name);
      return prev;
    }, new Set<string>()),
  ].sort((a, b) => a.localeCompare(b));
</script>

<div class="flex h-full flex-col gap-y-5 overflow-y-auto overflow-x-hidden p-5">
  {#each categories as category}
    <section class="flex flex-col gap-y-2">
      <span class="text-2xl font-bold">{category || 'อื่นๆ (Other)'}</span>
      <div class="-ml-5 flex gap-x-5 overflow-auto scroll-smooth pl-5 pb-3">
        {#each productsSorted as product}
          {#if product.attributes.category?.data?.attributes?.name === category}
            <Product
              product={product}
              class="transition-all hover:cursor-pointer hover:shadow-md"
            />
          {/if}
        {/each}
      </div>
    </section>
  {/each}
</div>
