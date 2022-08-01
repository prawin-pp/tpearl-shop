import type { ICategory } from './category.model';
import type { IPrice } from './price.model';

export interface IProduct {
  id: number;
  name: string;
  category: ICategory;
  prices: IPrice[];
  image: string;
}
