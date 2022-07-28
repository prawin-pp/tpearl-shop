export interface PriceModel {
  id: string;
  price: number;
  payment_channel: {
    data: PaymentChannelModel;
  };
}

export interface PaymentChannelModel {
  id: string;
  attributes: {
    name: 'CASH' | 'GRAB' | 'LINEMAN' | 'ROBINHOOD';
  };
}
