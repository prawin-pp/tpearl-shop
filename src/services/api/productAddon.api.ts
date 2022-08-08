import qs from 'qs';
import type { IProductAddon } from 'src/models/productAddon.model';
import client from './client.api';
import type { IProductAddonResponse } from './models/productAddon.model';
import type { IResponseList } from './models/response.model';

export const getProductAddons = async (): Promise<IProductAddon[]> => {
  const query = qs.stringify(
    {
      populate: ['image', 'prices.payment_channel'],
      pagination: {
        pageSize: 9999,
      },
    },
    { encodeValuesOnly: true }
  );
  const response = await client.get<IResponseList<IProductAddonResponse>>(
    `/api/product-addons?${query}`
  );
  return response.data.data.map<IProductAddon>((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
      prices: item.attributes.prices.map((price) => ({
        id: price.id,
        paymentChannel: {
          id: price.payment_channel.data.id,
          name: price.payment_channel.data.attributes.name,
        },
        price: price.price,
      })),
      image: item.attributes.image?.data,
    };
  });
};
