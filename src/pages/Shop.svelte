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
  import type {
    ICreatePaymentItemRequest,
    ICreatePaymentRequest,
  } from 'src/services/api/models/payment.model';
  import { createPayment } from 'src/services/api/payment.api';
  import numeral from 'numeral';
  import { ToastController } from 'src/utils/toast';
  import { currencyText } from 'src/utils/currency';
  import { paymentChannelText } from 'src/utils/paymentChannel';
  import type { ICategory } from 'src/models/category.model';
  import type { IProductAddon } from 'src/models/productAddon.model';
  import ProductAddonModal, { type IProductAddonForm } from 'src/lib/shop/ProductAddonModal.svelte';

  let productAddonModal: ProductAddonModal;
  let confirmDeleteAllProductModal: ConfirmModal;
  let confirmPaymentModal: ConfirmModal;
  let fullScreenPaymentChannel: FullScreenPaymentChannel;

  let products: IProduct[] = [];
  let productAddons: IProductAddon[] = [];
  let categories: ICategory[] = [];
  let paymentChannels: IPaymentChannel[] = [];
  let cart: ICart = { items: [], paymentChannel: 'CASH' };

  let selectedProduct: IProduct;

  function fetchProducts() {
    api.product.getProducts().then((items) => (products = items));
  }

  function fetchCategories() {
    api.category.getCategories().then((items) => (categories = items));
  }

  function fetchProductAddons() {
    api.productAddonApi.getProductAddons().then((items) => (productAddons = items));
  }

  function fetchPaymentChannels() {
    api.paymentChannel.getPaymentChannels().then((items) => (paymentChannels = items));
  }

  function handleOpenProductAddonModal(e: CustomEvent<IProduct>) {
    selectedProduct = e.detail;
    productAddonModal.show();
  }

  function handleAddProductToCart(e: CustomEvent<IProductAddonForm>) {
    const selectedProductAddon = e.detail;
    const index = cart.items.findIndex((cartItem) => {
      const isSameLength = cartItem.addons.length === selectedProductAddon.items.length;
      const isSameSweetness = cartItem.sweetness === selectedProductAddon.sweetness;
      const isSameAddonAndQuantity = cartItem.addons.every((addon) => {
        return selectedProductAddon.items.find((item) => {
          return item.product.id === addon.product.id && item.quantity === addon.quantity;
        });
      });
      return (
        cartItem.product.id === selectedProduct.id &&
        isSameLength &&
        isSameSweetness &&
        isSameAddonAndQuantity
      );
    });
    if (index >= 0) {
      cart.items[index].quantity++;
    } else {
      cart.items.push({
        product: selectedProduct,
        quantity: 1,
        addons: selectedProductAddon.items,
        sweetness: selectedProductAddon.sweetness,
      });
    }
    cart = { ...cart };
    productAddonModal.hide();
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
    const items = cart.items.map<ICreatePaymentItemRequest>((item) => ({
      product: {
        id: item.product.id,
      },
      price: item.product.prices.find((price) => price.paymentChannel.name === cart.paymentChannel)
        .price,
      quantity: item.quantity,
      addons: item.addons.map((addon) => ({
        product: {
          id: addon.product.id,
        },
        quantity: addon.quantity,
        price: addon.product.prices.find(
          (price) => price.paymentChannel.name === cart.paymentChannel
        ).price,
      })),
      sweetness: item.sweetness,
    }));
    const totalAmount = cart.items.reduce((prev, item) => {
      const addonAmount = item.addons.reduce((value, addon) => {
        const { price } = addon.product.prices.find(
          (price) => price.paymentChannel.name === cart.paymentChannel
        );
        return value + price * addon.quantity;
      }, 0);
      const { price } = item.product.prices.find(
        (price) => price.paymentChannel.name === cart.paymentChannel
      );
      const amount = (price + addonAmount) * item.quantity;
      return prev + amount;
    }, 0);
    const req: ICreatePaymentRequest = {
      items: items,
      payment_channel: {
        id: paymentChannels.find((pc) => pc.name === cart.paymentChannel).id,
      },
      total_amount: totalAmount,
    };

    await createPayment(req);

    ToastController.success(
      `ชำระเงินผ่านช่องทาง ${paymentChannelText[cart.paymentChannel]} เรียบร้อย`,
      `ทั้งหมด ${cart.items.length} รายการ ราคา ${currencyText(totalAmount)} บาท`,
      10000
    );

    cart = { ...cart, items: [], paymentChannel: 'CASH' };
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
    fetchCategories();
    fetchPaymentChannels();
    fetchProductAddons();
  });
</script>

<div id="shop" class="flex h-full w-full select-none">
  <section class="h-full w-3/4 overflow-hidden bg-gray-100">
    <ProductList
      products={products}
      categories={categories}
      paymentChannel={cart.paymentChannel}
      on:select-product={handleOpenProductAddonModal}
    />
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

<ProductAddonModal
  bind:this={productAddonModal}
  title={selectedProduct?.name}
  productAddons={productAddons}
  paymentChannel={cart.paymentChannel}
  on:submit={handleAddProductToCart}
/>
