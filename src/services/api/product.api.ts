import qs from 'qs';
import type { IProduct } from 'src/models/product.model';
import client from './client.api';
import type { IProductResponse } from './models/product.model';
import type { IResponseList } from './models/response.model';

export const getProducts = async (): Promise<IProduct[]> => {
  const query = qs.stringify(
    {
      populate: ['image', 'category', 'prices.payment_channel'],
      pagination: {
        pageSize: 9999,
      },
    },
    { encodeValuesOnly: true }
  );
  const response = await client.get<IResponseList<IProductResponse>>(`/api/products?${query}`);
  return response.data.data.map<IProduct>((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
      category: {
        id: item.attributes.category.data.id,
        name: item.attributes.category.data.attributes.name,
      },
      prices: item.attributes.prices.map((price) => ({
        id: price.id,
        paymentChannel: {
          id: price.payment_channel.data.id,
          name: price.payment_channel.data.attributes.name,
        },
        price: price.price,
      })),
      image: item.attributes.image?.data,
      cost: item.attributes.cost || 0,
    };
  });
};
