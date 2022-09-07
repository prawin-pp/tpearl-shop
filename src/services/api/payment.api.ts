import qs from 'qs';
import type { IPayment } from 'src/models/payment.model';
import client from './client.api';
import type {
  ICreatePaymentRequest,
  IPaymentResponse,
  ISearchPaymentCriteria,
} from './models/payment.model';
import type { IPaginationRequest } from './models/request.model';
import type { IResponseData, IResponseList } from './models/response.model';

export const searchPayments = async (
  criteria?: ISearchPaymentCriteria,
  pagination?: IPaginationRequest
) => {
  const query = qs.stringify(
    {
      filters: criteria
        ? {
            createdAt: {
              $gte: criteria.startAt,
              $lt: criteria.endAt,
            },
          }
        : {},
      populate: [
        'items',
        'items.product',
        'items.product.category',
        'items.addons',
        'items.addons.product',
        'payment_channel',
      ],
      pagination: pagination || {},
      sort: ['createdAt:desc'],
    },
    { encodeValuesOnly: true }
  );

  const response = await client.get<IResponseList<IPaymentResponse>>(`/api/payments?${query}`);

  const items = response.data.data.map<IPayment>((item) => {
    return {
      id: item.id,
      totalAmount: item.attributes.total_amount,
      items: item.attributes.items.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        product: {
          id: item.product.data.id,
          name: item.product.data.attributes.name,
          category: {
            id: item.product.data.attributes.category.data.id,
            name: item.product.data.attributes.category.data.attributes.name,
          },
          image: null,
          prices: null,
          cost: item.product.data.attributes.cost || 0,
        },
        addons: item.addons.map((addon) => ({
          product: {
            id: addon.product.data.id,
            name: addon.product.data.attributes.name,
            prices: null,
            image: null,
            cost: addon.product.data.attributes.cost,
          },
          quantity: addon.quantity,
          price: addon.price,
        })),
        sweetness: item.sweetness,
      })),
      paymentChannel: item.attributes.payment_channel.data.attributes.name,
      createdAt: new Date(item.attributes.createdAt),
      updatedAt: new Date(item.attributes.updatedAt),
    };
  });
  const meta = response.data.meta;
  return { meta, items };
};

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

export const deletePayment = async (paymentId: number) => {
  await client.delete(`/api/payments/${paymentId}`);
};
