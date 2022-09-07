export interface IPrice {
  id: number;
  price: number;
  paymentChannel: IPaymentChannel;
}

export interface IPaymentChannel {
  id: number;
  name: TPaymentChannel;
  grossProfit: number;
}

export type TPaymentChannel = 'CASH' | 'PROMPTPAY' | 'GRAB' | 'LINEMAN' | 'ROBINHOOD';
