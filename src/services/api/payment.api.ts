import qs from 'qs';
import client from './client.api';
import type { ICreatePaymentRequest, IPaymentResponse } from './models/payment.model';
import type { IResponseData } from './models/response.model';

export const createPayment = async (req: ICreatePaymentRequest) => {
  const query = qs.stringify(
    {
      populate: ['payment_channel', 'items', 'items.product'],
    },
    { encodeValuesOnly: true }
  );
  const requestBody = { data: req };

  const response = await client.post<IResponseData<IPaymentResponse>>(
    `/api/payments?${query}`,
    requestBody
  );
  return response.data.data;
};
