<script lang="ts">
  import type { ProductModel } from 'src/models/product.model';

  import { onMount } from 'svelte';
  import api from 'src/services/api';
  import ProductList from 'src/lib/ProductList.svelte';
  import Cart from 'src/lib/Cart.svelte';

  let products: ProductModel[] = [];

  function _fetchProducts() {
    api.product.getProducts().then((response) => (products = response.data));
  }

  onMount(() => {
    _fetchProducts();
  });
</script>

<div id="shop" class="flex h-full w-full">
  <section class="h-full w-3/4 overflow-hidden bg-gray-100">
    <ProductList products={products} />
  </section>
  <aside class="h-full w-1/4 min-w-[320px] overflow-hidden bg-white">
    <Cart />
  </aside>
</div>
