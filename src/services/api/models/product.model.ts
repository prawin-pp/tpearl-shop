import type { IImage } from 'src/models/image.model';
import type { ICategoryResponse } from './category.model';
import type { IPriceResponse } from './price.model';

export interface IProductResponse {
  id: number;
  attributes: {
    name: string;
    image?: {
      data: IImage;
    };
    category: {
      data: ICategoryResponse;
    };
    prices: IPriceResponse[];
  };
}
