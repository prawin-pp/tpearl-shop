<script lang="ts">
  import type { ProductModel } from 'src/models/product.model';

  import { onMount } from 'svelte';
  import api from 'src/services/api';
  import ProductList from 'src/lib/ProductList.svelte';

  let products: ProductModel[] = [];

  function _fetchProducts() {
    api.product.getProducts().then((productList) => (products = productList));
  }

  onMount(() => {
    _fetchProducts();
  });
</script>

<div id="shop" class="flex h-full w-full">
  <section class="flex h-full flex-[3] flex-col overflow-hidden bg-gray-100">
    <ProductList products={products} />
  </section>
  <aside class="flex-1" />
</div>
