import type { IPaymentChannelResponse } from './price.model';
import type { IProductResponse } from './product.model';
import type { IProductAddonResponse } from './productAddon.model';
import type { IResponseData, IResponseList } from './response.model';

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
  addons: ICreatePaymentAddonItemRequest[];
  sweetness: number;
}

export interface ICreatePaymentAddonItemRequest {
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
      addons: IPaymentProductAddonItemResponse[];
      sweetness: number;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface IPaymentProductAddonItemResponse {
  id: number;
  quantity: number;
  price: number;
  product: IResponseData<IProductAddonResponse>;
}

export interface ISearchPaymentCriteria {
  startAt?: string;
  endAt?: string;
}
