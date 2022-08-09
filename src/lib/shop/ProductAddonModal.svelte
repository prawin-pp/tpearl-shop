<script lang="ts" context="module">
  export interface IProductAddonForm {
    sweetness: number;
    items: IProductAddonItem[];
  }

  export interface IProductAddonItem {
    product: IProductAddon;
    quantity: number;
  }

  export interface IProductAddonModalEvent {
    submit: IProductAddonForm;
  }
</script>

<script lang="ts">
  import config from 'src/config';
  import type { TPaymentChannel } from 'src/models/price.model';

  import type { IProductAddon } from 'src/models/productAddon.model';
  import { currencyText, priceText } from 'src/utils/currency';
  import { createEventDispatcher } from 'svelte';
  import Button from '../common/Button.svelte';
  import Icon from '../common/Icon.svelte';
  import ImageSkeleton from '../common/ImageSkeleton.svelte';

  import Modal from '../common/Modal.svelte';
  import Product from './Product.svelte';

  const dispatch = createEventDispatcher<IProductAddonModalEvent>();

  let modalElement: Modal;

  export let title: string = '';
  export let paymentChannel: TPaymentChannel;
  export let productAddons: IProductAddon[] = [];

  $: items = productAddons.map<IProductAddonItem>((item) => ({ product: item, quantity: 0 }));
  $: prices = productAddons.reduce((value, item) => {
    const price = item.prices.find((price) => price.paymentChannel.name === paymentChannel);
    value[item.id] = price.price || 0;
    return value;
  }, {} as Record<string, number>);

  let sweetness = 100;

  export function show() {
    reset();
    modalElement?.show();
  }

  export function hide() {
    modalElement?.hide();
  }

  function reset() {
    sweetness = 100;
    const newItems = items?.map((item) => {
      return {
        product: { ...item.product },
        quantity: 0,
      };
    });
    items = newItems || [];
  }

  function handleIncreaseQuantity(item: IProductAddonItem) {
    item.quantity += 1;
    items = [...items];
  }

  function handleDecreaseQuantity(item: IProductAddonItem) {
    if (item.quantity > 0) {
      item.quantity -= 1;
      items = [...items];
    }
  }

  function handleChangeSweetness(value: number) {
    sweetness = value;
  }

  function handleCancel() {
    modalElement?.hide();
  }

  function handleConfirm() {
    const filteredItems = items.filter((item) => item.quantity > 0);
    dispatch('submit', { items: [...filteredItems], sweetness: sweetness });
  }
</script>

<Modal bind:this={modalElement} title={title}>
  <div slot="body" class="flex flex-col gap-y-10">
    <section id="select-sweetness" class="flex flex-col gap-y-4">
      <span>กรุณาเลือกความหวาน</span>
      <div class="inline-flex rounded-xl shadow-sm" role="group">
        <button
          type="button"
          class="flex-1 rounded-l-xl border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-rose-600 focus:z-10 focus:text-rose-600 focus:ring-2 focus:ring-rose-600"
          class:ring-rose-600={sweetness === 0}
          class:ring-2={sweetness === 0}
          class:z-10={sweetness === 0}
          on:click={() => handleChangeSweetness(0)}
        >
          0%
        </button>
        <button
          type="button"
          class="flex-1 border-t border-b border-r border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-rose-600 focus:z-10 focus:text-rose-600 focus:ring-2 focus:ring-rose-600"
          class:ring-rose-600={sweetness === 50}
          class:ring-2={sweetness === 50}
          class:z-10={sweetness === 50}
          on:click={() => handleChangeSweetness(50)}
        >
          50%
        </button>
        <button
          type="button"
          class="flex-1 border-t border-b border-r border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-rose-600 focus:z-10 focus:text-rose-600 focus:ring-2 focus:ring-rose-600"
          class:ring-rose-600={sweetness === 100}
          class:ring-2={sweetness === 100}
          class:z-10={sweetness === 100}
          on:click={() => handleChangeSweetness(100)}
        >
          100%
        </button>
        <button
          type="button"
          class="flex-1 border-t border-b border-r border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-rose-600 focus:z-10 focus:text-rose-600 focus:ring-2 focus:ring-rose-600"
          class:ring-rose-600={sweetness === 150}
          class:ring-2={sweetness === 150}
          class:z-10={sweetness === 150}
          on:click={() => handleChangeSweetness(150)}
        >
          150%
        </button>
        <button
          type="button"
          class="flex-1 rounded-r-xl border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-rose-600 focus:z-10 focus:text-rose-600 focus:ring-2 focus:ring-rose-600"
          class:ring-rose-600={sweetness === 200}
          class:ring-2={sweetness === 200}
          class:z-10={sweetness === 200}
          on:click={() => handleChangeSweetness(200)}
        >
          200%
        </button>
      </div>
    </section>
    <section id="select-topping" class="flex flex-col gap-y-4">
      <span>กรุณาเลือกท็อปปิ้ง</span>
      <div class="grid grid-cols-2 gap-5 rounded-xl">
        {#each items as item}
          <div class="grid grid-cols-[96px_1fr] rounded-xl bg-gray-50 p-4">
            <div class="h-24 w-24 overflow-hidden rounded-xl bg-white">
              {#if item.product.image}
                <img
                  src={config.apiBaseUrl + item.product.image.attributes.formats.small.url}
                  alt={item.product.image.attributes.alternativeText}
                />
              {:else}
                <ImageSkeleton class="flex h-24 w-24" />
              {/if}
            </div>
            <div class="grid grid-flow-row auto-rows-min gap-y-1">
              <span class="pl-4 line-clamp-2" class:text-gray-500={prices[item.product.id] === 0}>
                {item.product.name}
              </span>
              <span
                class="pl-4 font-bold text-rose-600"
                class:text-gray-500={prices[item.product.id] === 0}
              >
                {priceText(prices[item.product.id])}
                {#if item.quantity > 0}
                  x {item.quantity} = {currencyText(prices[item.product.id] * item.quantity)}
                {/if}
              </span>
              {#if prices[item.product.id] > 0}
                <div class="flex items-center gap-4 pl-4">
                  <Icon
                    class="cursor-pointer rounded-xl bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300"
                    on:click={() => handleDecreaseQuantity(item)}
                  >
                    remove
                  </Icon>
                  <span>{item.quantity}</span>
                  <Icon
                    class="cursor-pointer rounded-xl bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300"
                    on:click={() => handleIncreaseQuantity(item)}
                  >
                    add
                  </Icon>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>
  <div slot="footer" class="flex w-full justify-between">
    <Button
      class="border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-100 hover:text-rose-600 focus:ring-2 focus:ring-rose-600"
      type="button"
      on:click={handleCancel}
    >
      ยกเลิก
    </Button>
    <Button
      class="bg-rose-600 text-white transition-all focus:bg-rose-600 focus:ring focus:ring-rose-300"
      type="button"
      on:click={handleConfirm}
    >
      ยืนยัน
    </Button>
  </div>
</Modal>
