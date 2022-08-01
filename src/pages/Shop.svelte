<script lang="ts">
  import type { IProduct } from 'src/models/product.model';

  import { onMount } from 'svelte';
  import api from 'src/services/api';
  import ProductList from 'src/lib/shop/ProductList.svelte';
  import Cart, { type ICart } from 'src/lib/shop/Cart.svelte';
  import type { ICartItem } from 'src/lib/shop/CartItem.svelte';
  import ConfirmModal from 'src/lib/common/ConfirmModal.svelte';
  import FullScreenPaymentChannel from 'src/lib/shop/FullScreenPaymentChannel.svelte';
  import type { IPaymentChannel, TPaymentChannel } from 'src/models/price.model';
  import type { ICreatePaymentRequest } from 'src/services/api/models/payment.model';
  import { createPayment } from 'src/services/api/payment.api';
  import numeral from 'numeral';

  let confirmDeleteAllProductModal: ConfirmModal;
  let confirmPaymentModal: ConfirmModal;
  let fullScreenPaymentChannel: FullScreenPaymentChannel;

  let products: IProduct[] = [];
  let paymentChannels: IPaymentChannel[] = [];
  let cart: ICart = { items: [], paymentChannel: 'CASH' };

  function fetchProducts() {
    api.product.getProducts().then((items) => (products = items));
  }

  function fetchPaymentChannels() {
    api.paymentChannel.getPaymentChannels().then((items) => (paymentChannels = items));
  }

  function handleAddProductToCart(e: CustomEvent<IProduct>) {
    const product = e.detail;
    const index = cart.items.findIndex((item) => item.product.id === product.id);
    if (index >= 0) {
      cart.items[index].quantity++;
    } else {
      cart.items.push({ product, quantity: 1 });
    }
    cart = { ...cart };
  }

  function handleIncreaseProductQuantity(e: CustomEvent<ICartItem>) {
    const index = cart.items.findIndex((item) => item.product.id === e.detail.product.id);
    cart.items[index].quantity++;
    cart = { ...cart };
  }

  function handleDecreaseProductQuantity(e: CustomEvent<ICartItem>) {
    const index = cart.items.findIndex((item) => item.product.id === e.detail.product.id);
    if (cart.items[index].quantity === 1) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity--;
    }
    cart = { ...cart };
  }

  function handleRemoveAllProduct() {
    cart = { ...cart, items: [] };
    confirmDeleteAllProductModal.hide();
  }

  function handleUpdatePaymentChannel(e: CustomEvent<TPaymentChannel>) {
    cart = { ...cart, paymentChannel: e.detail };
    fullScreenPaymentChannel.hide();
  }

  async function handleCreatePayment() {
    const items = cart.items.map((item) => ({
      product: {
        id: item.product.id,
      },
      price: item.product.prices.find((price) => price.paymentChannel.name === cart.paymentChannel)
        .price,
      quantity: item.quantity,
    }));
    const totalAmount = cart.items.reduce((prev, item) => {
      return numeral(item.quantity)
        .multiply(
          item.product.prices.find((price) => price.paymentChannel.name === cart.paymentChannel)
            .price
        )
        .add(prev)
        .value();
    }, 0);
    const req: ICreatePaymentRequest = {
      items: items,
      payment_channel: {
        id: paymentChannels.find((pc) => pc.name === cart.paymentChannel).id,
      },
      total_amount: totalAmount,
    };

    await createPayment(req);

    handleRemoveAllProduct();
    confirmPaymentModal.hide();
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

  onMount(() => {
    fetchProducts();
    fetchPaymentChannels();
  });
</script>

<div id="shop" class="flex h-full w-full select-none">
  <section class="h-full w-3/4 overflow-hidden bg-gray-100">
    <ProductList products={products} on:select-product={handleAddProductToCart} />
  </section>
  <aside class="h-full w-1/4 min-w-[320px] overflow-hidden bg-white">
    <Cart
      cart={cart}
      on:increase-quantity={handleIncreaseProductQuantity}
      on:decrease-quantity={handleDecreaseProductQuantity}
      on:clear-all={handleOpenConfirmClearAllProductModal}
      on:select-payment-channel={handleOpenFullScreenPaymentChannel}
      on:paid={handleOpenPaymentConfirmModal}
    />
  </aside>
</div>

<ConfirmModal
  title="คุณต้องการที่จะลบสินค้าทั้งหมดใช่หรือไม่?"
  bind:this={confirmDeleteAllProductModal}
  onConfirm={handleRemoveAllProduct}
/>

<ConfirmModal
  title="ยืนยันการชำระเงิน?"
  bind:this={confirmPaymentModal}
  onConfirm={handleCreatePayment}
/>

<FullScreenPaymentChannel
  bind:this={fullScreenPaymentChannel}
  on:select-payment-channel={handleUpdatePaymentChannel}
/>
