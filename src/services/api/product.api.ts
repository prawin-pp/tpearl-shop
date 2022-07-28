import type { ProductModel } from 'src/models/product.model';
import client from './client';
import type { ResponseList } from './model';
import qs from 'qs';

export const getProducts = async () => {
  const query = qs.stringify(
    {
      populate: ['image', 'category', 'prices.payment_channel'],
    },
    { encodeValuesOnly: true }
  );
  const response = await client.get<ResponseList<ProductModel>>(`/products?${query}`);
  return response.data;
};
