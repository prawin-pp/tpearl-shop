import type { IImage } from './image.model';
import type { IPrice } from './price.model';

export interface IProductAddon {
  id: number;
  name: string;
  prices: IPrice[];
  image: IImage;
}
