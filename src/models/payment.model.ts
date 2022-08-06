import type { TPaymentChannel } from './price.model';
import type { IProduct } from './product.model';

export interface IPayment {
  id: number;
  totalAmount: number;
  items: IPaymentItem[];
  paymentChannel: TPaymentChannel;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentItem {
  quantity: number;
  price: number;
  product: IProduct;
}
