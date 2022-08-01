export interface IPrice {
  id: number;
  price: number;
  paymentChannel: IPaymentChannel;
}

export interface IPaymentChannel {
  id: number;
  name: TPaymentChannel;
}

export type TPaymentChannel = 'CASH' | 'PROMPTPAY' | 'GRAB' | 'LINEMAN' | 'ROBINHOOD';
