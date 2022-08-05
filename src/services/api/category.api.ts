import qs from 'qs';
import type { ICategory } from 'src/models/category.model';
import client from './client.api';
import type { ICategoryResponse } from './models/category.model';
import type { IResponseList } from './models/response.model';

export const getCategories = async (): Promise<ICategory[]> => {
  const query = qs.stringify({}, { encodeValuesOnly: true });
  const response = await client.get<IResponseList<ICategoryResponse>>(`/api/categories?${query}`);
  return response.data.data.map<ICategory>((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
    };
  });
};
