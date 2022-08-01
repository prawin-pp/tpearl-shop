import type { ICategoryResponse } from './category.model';
import type { IPriceResponse } from './price.model';

export interface IProductResponse {
  id: number;
  attributes: {
    name: string;
    image: {
      data: string;
    };
    category: {
      data: ICategoryResponse;
    };
    prices: IPriceResponse[];
  };
}
