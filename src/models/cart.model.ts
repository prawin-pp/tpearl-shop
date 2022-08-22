import type { IProductAddonItem } from 'src/lib/shop/ProductAddonModal.svelte';
import type {
  ICreatePaymentAddonItemRequest,
  ICreatePaymentItemRequest,
  ICreatePaymentRequest,
} from 'src/services/api/models/payment.model';
import type { IPaymentChannel, TPaymentChannel } from './price.model';
import type { IProduct } from './product.model';
import type { IProductAddon } from './productAddon.model';

export class CartModel {
  items: ICartItem[] = [];
  paymentChannel: TPaymentChannel = 'CASH';

  get totalAmount() {
    return this.items.reduce((value, item) => {
      const addonsAmount = item.addons.reduce((value, item) => {
        const { price } = item.product.prices.find(
          (price) => price.paymentChannel.name === this.paymentChannel
        );
        return value + price * item.quantity;
      }, 0);

      const { price: productAmount } = item.product.prices.find(
        (price) => price.paymentChannel.name === this.paymentChannel
      );
      const amount = (productAmount + addonsAmount) * item.quantity;
      return value + amount;
    }, 0);
  }

  add(product: IProduct, addons: IProductAddonItem[], sweetness: number) {
    const isCustom = product.category.name === 'อื่นๆ';
    const index = this.items.findIndex((cartItem) => {
      const isSameProduct = cartItem.product.id === product.id;
      const isSameSweetness = cartItem.sweetness === sweetness;
      const isSameLength = cartItem.addons.length === addons.length;
      const isSameAddonAndQuantity = cartItem.addons.every((cartItemAddon) => {
        return addons.find(
          (addon) =>
            addon.product.id === cartItemAddon.product.id &&
            addon.quantity === cartItemAddon.quantity
        );
      });
      return isSameProduct && isSameSweetness && isSameLength && isSameAddonAndQuantity;
    });
    1;
    if (!isCustom && index >= 0) {
      this.items[index].quantity++;
      return this.clone();
    }

    this.items.push({
      product: product,
      quantity: 1,
      addons: addons,
      sweetness: sweetness,
    });
    return this.clone();
  }

  increase(cartItem: ICartItem) {
    const index = this.items.findIndex((item) => {
      return (
        item.product.id === cartItem.product.id &&
        item.sweetness === cartItem.sweetness &&
        item.addons === cartItem.addons &&
        item.quantity === cartItem.quantity
      );
    });
    if (index >= 0) {
      this.items[index].quantity++;
    }
    return this.clone();
  }

  decrease(cartItem: ICartItem) {
    const index = this.items.findIndex((item) => {
      return (
        item.product.id === cartItem.product.id &&
        item.sweetness === cartItem.sweetness &&
        item.addons === cartItem.addons &&
        item.quantity === cartItem.quantity
      );
    });
    if (index >= 0) {
      if (this.items[index].quantity === 1) {
        this.items.splice(index, 1);
      } else {
        this.items[index].quantity--;
      }
    }
    return this.clone();
  }

  setPaymentChannel(paymentChannel: TPaymentChannel) {
    this.paymentChannel = paymentChannel;
    return this.clone();
  }

  clear() {
    this.items = [];
    return this.clone();
  }

  reset() {
    this.items = [];
    this.paymentChannel = 'CASH';
    return this.clone();
  }

  private clone() {
    return Object.assign(new CartModel(), this);
  }

  toCreatePaymentRequest(paymentChannels: IPaymentChannel[]): ICreatePaymentRequest {
    return {
      items: this.items.map<ICreatePaymentItemRequest>((item) => {
        const { price } = item.product.prices.find(
          (price) => price.paymentChannel.name === this.paymentChannel
        );
        return {
          product: { id: item.product.id },
          price: price,
          addons: item.addons.map<ICreatePaymentAddonItemRequest>((addon) => {
            const { price } = addon.product.prices.find(
              (price) => price.paymentChannel.name === this.paymentChannel
            );
            return {
              product: { id: addon.product.id },
              quantity: addon.quantity,
              price: price,
            };
          }),
          quantity: item.quantity,
          sweetness: item.sweetness,
        };
      }),
      payment_channel: {
        id: paymentChannels.find((channel) => channel.name === this.paymentChannel).id,
      },
      total_amount: this.totalAmount,
    };
  }
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  addons: ICartAddonItem[];
  sweetness: number;
}

export interface ICartAddonItem {
  product: IProductAddon;
  quantity: number;
}
