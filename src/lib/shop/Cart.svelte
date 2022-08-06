<script lang="ts" context="module">
  export interface ICart {
    items: ICartItem[];
    paymentChannel?: TPaymentChannel;
  }

  export interface ICartEvent {
    'select-payment-channel': void;
    'clear-all': void;
    paid: void;
  }
</script>

<script lang="ts">
  import numeral from 'numeral';

  import type { TPaymentChannel } from 'src/models/price.model';
  import { currencyText } from 'src/utils/currency';
  import { createEventDispatcher } from 'svelte';

  import CartItem, { type ICartItem } from './CartItem.svelte';
  import Button from '../common/Button.svelte';
  import Icon from '../common/Icon.svelte';
  import { paymentChannelText } from 'src/utils/paymentChannel';

  const dispatch = createEventDispatcher<ICartEvent>();

  export let cart: ICart = {
    items: [],
    paymentChannel: 'CASH',
  };

  $: totalAmount = cart.items.reduce((prev, item) => {
    const priceByChannel = item.product.prices.find(
      (price) => price.paymentChannel.name === cart.paymentChannel
    );
    return prev + numeral(priceByChannel.price).multiply(item.quantity).value();
  }, 0);
</script>

<div id="cart" class="flex h-full flex-col gap-y-5">
  <section class="flex h-12 items-center px-4 pt-4">
    <span class="text-2xl font-bold">ออเดอร์</span>
    <Icon
      class="{cart.items.length === 0
        ? 'text-gray-500'
        : 'bg-rose-200 text-rose-600 hover:cursor-pointer hover:bg-rose-600 hover:text-white'} ml-auto h-10 w-10 rounded-lg p-2 transition"
      disabled={cart.items.length === 0}
      on:click={() => dispatch('clear-all')}
    >
      clear
    </Icon>
  </section>
  <section class="overflow-auto">
    {#each cart.items as item}
      <CartItem
        class="transition hover:bg-gray-100"
        item={item}
        paymentChannel={cart.paymentChannel}
        on:increase-quantity
        on:decrease-quantity
      />
    {/each}
  </section>
  <section class="mt-auto flex flex-col gap-y-4 px-4">
    <div class="h-0 border-t-2 border-dashed border-gray-200" />
    <div class="flex justify-between text-xl font-bold">
      <span>ยอดรวม</span>
      <span>{currencyText(totalAmount)}</span>
    </div>
  </section>
  <section class="flex flex-col gap-y-4 px-4 pb-4">
    <Button
      class="
      {cart.paymentChannel === 'CASH' ? 'bg-cash' : ''}
      {cart.paymentChannel === 'PROMPTPAY' ? 'bg-promptpay' : ''}
      {cart.paymentChannel === 'GRAB' ? 'bg-grab' : ''}
      {cart.paymentChannel === 'LINEMAN' ? 'bg-lineman' : ''}
      {cart.paymentChannel === 'ROBINHOOD' ? 'bg-robinhood' : ''}
      text-white transition-all focus:bg-blue-600 focus:ring focus:ring-blue-300"
      on:click={() => dispatch('select-payment-channel')}
    >
      ช่องทางชำระเงิน : {paymentChannelText[cart.paymentChannel]}
    </Button>
    <Button
      class="{cart.items.length === 0
        ? 'cursor-default bg-gray-200'
        : 'bg-rose-600 text-white focus:bg-rose-600 focus:ring focus:ring-rose-300'} transition-all"
      disabled={cart.items.length === 0}
      on:click={() => dispatch('paid')}
    >
      ชำระเงิน
    </Button>
  </section>
</div>
