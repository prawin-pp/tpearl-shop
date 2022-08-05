import * as authApi from './authentication.api';
import * as categoryApi from './category.api';
import * as productApi from './product.api';
import * as paymentApi from './payment.api';
import * as paymentChannelApi from './paymentChannel.api';

export default {
  auth: authApi,
  category: categoryApi,
  product: productApi,
  payment: paymentApi,
  paymentChannel: paymentChannelApi,
};
