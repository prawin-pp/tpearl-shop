import type { CategoryModel } from './category.model';
import type { ImageModel } from './image.model';
import type { PriceModel } from './price.model';

export interface ProductModel {
  id: string;
  name: string;
  category: CategoryModel;
  prices: PriceModel[];
  image?: ImageModel;
}
