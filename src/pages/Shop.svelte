<script lang="ts">
  import ConfirmModal from 'src/lib/common/ConfirmModal.svelte';
  import Cart from 'src/lib/shop/Cart.svelte';
  import type { ICartItem } from 'src/lib/shop/CartItem.svelte';
  import FullScreenPaymentChannel from 'src/lib/shop/FullScreenPaymentChannel.svelte';
  import FullScreenSelectCashOrPromptPay from 'src/lib/shop/FullScreenSelectCashOrPromptPay.svelte';
  import ProductAddonModal, { type IProductAddonForm } from 'src/lib/shop/ProductAddonModal.svelte';
  import ProductList from 'src/lib/shop/ProductList.svelte';
  import { CartModel } from 'src/models/cart.model';
  import type { ICategory } from 'src/models/category.model';
  import type { IPaymentChannel, TPaymentChannel } from 'src/models/price.model';
  import type { IProduct } from 'src/models/product.model';
  import type { IProductAddon } from 'src/models/productAddon.model';
  import api from 'src/services/api';
  import { currencyText } from 'src/utils/currency';
  import { paymentChannelText } from 'src/utils/paymentChannel';
  import { ToastController } from 'src/utils/toast';
  import { onMount } from 'svelte';

  let productAddonModal: ProductAddonModal;
  let confirmDeleteAllProductModal: ConfirmModal;
  let confirmPaymentModal: ConfirmModal;
  let fullScreenPaymentChannel: FullScreenPaymentChannel;
  let fullScreenSelectCashOrPromptPay: FullScreenSelectCashOrPromptPay;

  let products: IProduct[] = [];
  let productAddons: IProductAddon[] = [];
  let categories: ICategory[] = [];
  let paymentChannels: IPaymentChannel[] = [];
  let cart = new CartModel();

  let selectedProduct: IProduct;

  function fetchProducts() {
    api.product.getProducts().then((items) => (products = items));
  }

  function fetchProductAddons() {
    api.productAddonApi.getProductAddons().then((items) => (productAddons = items));
  }

  function fetchCategories() {
    api.category.getCategories().then((items) => (categories = items));
  }

  function fetchPaymentChannels() {
    api.paymentChannel.getPaymentChannels().then((items) => (paymentChannels = items));
  }

  async function handleCreatePayment() {
    const req = cart.toCreatePaymentRequest(paymentChannels);

    await api.payment.createPayment(req);

    ToastController.success(
      `ชำระเงินผ่านช่องทาง ${paymentChannelText[cart.paymentChannel]} เรียบร้อย`,
      `ทั้งหมด ${cart.items.length} รายการ ราคา ${currencyText(cart.totalAmount)} บาท`,
      10000
    );

    refresh();
  }

  function refresh() {
    cart = cart.reset();
    productAddonModal.hide();
    confirmDeleteAllProductModal.hide();
    confirmPaymentModal.hide();
    fullScreenPaymentChannel.hide();
    fullScreenSelectCashOrPromptPay.hide();
  }

  function handleAddProductToCart(e: CustomEvent<IProductAddonForm>) {
    cart = cart.add(selectedProduct, e.detail.items, e.detail.sweetness);
    productAddonModal.hide();
  }

  function handleIncreaseProductQuantity(e: CustomEvent<ICartItem>) {
    cart = cart.increase(e.detail);
  }

  function handleDecreaseProductQuantity(e: CustomEvent<ICartItem>) {
    cart = cart.decrease(e.detail);
  }

  function handleRemoveAllProduct() {
    cart = cart.clear();
    confirmDeleteAllProductModal.hide();
  }

  function handleUpdatePaymentChannel(e: CustomEvent<TPaymentChannel>) {
    cart = cart.setPaymentChannel(e.detail);
    fullScreenPaymentChannel.hide();
  }

  function handleUpdatePaymentChannelAndCreatePayment(e: CustomEvent<'CASH' | 'PROMPTPAY'>) {
    cart = cart.setPaymentChannel(e.detail);
    return handleCreatePayment();
  }

  function handleConfirmSubmitPayment() {
    if (cart.paymentChannel === 'CASH') {
      return fullScreenSelectCashOrPromptPay.show();
    }
    return handleCreatePayment();
  }

  function handleScrollToElement(selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleOpenConfirmClearAllProductModal() {
    if (cart.items.length === 0) return;
    confirmDeleteAllProductModal.show();
  }

  function handleOpenPaymentConfirmModal() {
    confirmPaymentModal.show();
  }

  function handleOpenFullScreenPaymentChannel() {
    fullScreenPaymentChannel.show();
  }

  function handleOpenProductAddonModal(e: CustomEvent<IProduct>) {
    selectedProduct = e.detail;
    productAddonModal.show();
  }

  onMount(() => {
    fetchProducts();
    fetchCategories();
    fetchPaymentChannels();
    fetchProductAddons();
  });
</script>

<div id="shop" class="flex h-full w-full select-none">
  <section class="flex h-full w-3/4 flex-col overflow-hidden bg-gray-100">
    <div class="flex gap-4 overflow-x-auto px-5 py-3 shadow-sm">
      {#each categories as category}
        <div
          class="flex items-center justify-center whitespace-nowrap rounded-xl bg-white px-4 py-2 text-gray-600 transition hover:shadow"
          on:click={() => handleScrollToElement(`#section-category-${category.id}`)}
        >
          {category.name.split(' ')[0]}
        </div>
      {/each}
    </div>
    <ProductList
      products={products}
      categories={categories}
      paymentChannel={cart.paymentChannel}
      on:select-product={handleOpenProductAddonModal}
    />
  </section>
  <div class="h-full w-1/4 min-w-[320px] overflow-hidden bg-white">
    <Cart
      cart={cart}
      on:increase-quantity={handleIncreaseProductQuantity}
      on:decrease-quantity={handleDecreaseProductQuantity}
      on:clear-all={handleOpenConfirmClearAllProductModal}
      on:select-payment-channel={handleOpenFullScreenPaymentChannel}
      on:paid={handleOpenPaymentConfirmModal}
    />
  </div>
</div>

<ConfirmModal
  title="คุณต้องการที่จะลบสินค้าทั้งหมดใช่หรือไม่?"
  bind:this={confirmDeleteAllProductModal}
  onConfirm={handleRemoveAllProduct}
/>

<ConfirmModal
  title="ยืนยันการชำระเงิน?"
  bind:this={confirmPaymentModal}
  onConfirm={handleConfirmSubmitPayment}
/>

<FullScreenPaymentChannel
  bind:this={fullScreenPaymentChannel}
  on:select-payment-channel={handleUpdatePaymentChannel}
/>

<FullScreenSelectCashOrPromptPay
  bind:this={fullScreenSelectCashOrPromptPay}
  on:select-payment-channel={handleUpdatePaymentChannelAndCreatePayment}
  on:cancel={() => confirmPaymentModal.hide()}
/>

<ProductAddonModal
  bind:this={productAddonModal}
  title={selectedProduct?.name}
  productAddons={productAddons}
  paymentChannel={cart.paymentChannel}
  on:submit={handleAddProductToCart}
/>
