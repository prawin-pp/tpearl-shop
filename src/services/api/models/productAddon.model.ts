import type { IImage } from 'src/models/image.model';
import type { IPriceResponse } from './price.model';
import type { IResponseData } from './response.model';

export interface IProductAddonResponse {
  id: number;
  attributes: {
    name: string;
    image?: IResponseData<IImage>;
    prices?: IPriceResponse[];
    cost: number;
  };
}
