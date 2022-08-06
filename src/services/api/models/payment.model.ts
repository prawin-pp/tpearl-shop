import type { IPaymentChannelResponse } from './price.model';
import type { IProductResponse } from './product.model';
import type { IResponseData } from './response.model';

export interface ICreatePaymentRequest {
  items: ICreatePaymentItemRequest[];
  total_amount: number;
  payment_channel: {
    id: number;
  };
}

export interface ICreatePaymentItemRequest {
  product: {
    id: number;
  };
  quantity: number;
  price: number;
}

export interface IPaymentResponse {
  id: number;
  attributes: {
    total_amount: number;
    payment_channel: IResponseData<IPaymentChannelResponse>;
    items: {
      quantity: number;
      price: number;
      product: IResponseData<IProductResponse>;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface ISearchPaymentCriteria {
  startAt?: string;
  endAt?: string;
}
