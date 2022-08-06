import type { IImage } from 'src/models/image.model';
import type { ICategoryResponse } from './category.model';
import type { IPriceResponse } from './price.model';
import type { IResponseData } from './response.model';

export interface IProductResponse {
  id: number;
  attributes: {
    name: string;
    image?: IResponseData<IImage>;
    category?: IResponseData<ICategoryResponse>;
    prices?: IPriceResponse[];
  };
}
