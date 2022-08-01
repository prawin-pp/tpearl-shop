import type { IPaymentChannel } from 'src/models/price.model';
import client from './client.api';
import type { IPaymentChannelResponse } from './models/price.model';
import type { IResponseList } from './models/response.model';

export const getPaymentChannels = async () => {
  const response = await client.get<IResponseList<IPaymentChannelResponse>>(
    `/api/payment-channels`
  );
  return response.data.data.map<IPaymentChannel>((item) => ({
    id: item.id,
    name: item.attributes.name,
  }));
};
