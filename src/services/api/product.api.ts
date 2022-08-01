import type { IProduct } from 'src/models/product.model';
import client from './client.api';
import type { IResponseList } from './models/response.model';
import qs from 'qs';
import type { IProductResponse } from './models/product.model';

export const getProducts = async (): Promise<IProduct[]> => {
  const query = qs.stringify(
    {
      populate: ['image', 'category', 'prices.payment_channel'],
    },
    { encodeValuesOnly: true }
  );
  const response = await client.get<IResponseList<IProductResponse>>(`/products?${query}`);
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
      image: '',
    };
  });
};
