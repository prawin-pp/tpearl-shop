import type { IPagination } from 'src/models/pagination.model';

export interface IResponseList<T> {
  data: T[];
  meta: {
    pagination: IPagination;
  };
}

export interface IResponseData<T> {
  data: T;
  meta: {};
}
