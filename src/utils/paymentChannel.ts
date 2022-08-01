import type { TPaymentChannel } from 'src/models/price.model';

export const paymentChannelText: Record<TPaymentChannel, string> = {
  CASH: 'เงินสด',
  PROMPTPAY: 'พร้อมเพย์',
  GRAB: 'Grab',
  LINEMAN: 'LINE MAN',
  ROBINHOOD: 'Robinhood',
};
