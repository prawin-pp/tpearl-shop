import type { CategoryModel } from './category.model';
import type { PriceModel } from './price.model';

export interface ProductModel {
  id: string;
  attributes: {
    name: string;
    image: {
      data: string;
    };
    category: {
      data: CategoryModel;
    };
    prices: PriceModel[];
  };
}
