import type { ProductModel } from 'src/models/product.model';
import client from './client';

export const getProducts = async () => {
  const response = await client.get<ProductModel[]>('/products');
  return response.data;
};
