import type { TPaymentChannel } from 'src/models/price.model';

export interface IPriceResponse {
  id: number;
  price: number;
  payment_channel: {
    data: IPaymentChannelResponse;
  };
}

export interface IPaymentChannelResponse {
  id: number;
  attributes: {
    name: TPaymentChannel;
    gross_profit: number;
  };
}
