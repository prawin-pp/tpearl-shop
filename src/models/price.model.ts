export interface PriceModel {
  id: string;
  payment_channel: PaymentChannelModel;
  price: number;
}

export interface PaymentChannelModel {
  id: string;
  name: 'CASH' | 'GRAB' | 'LINEMAN' | 'ROBINHOOD';
}
