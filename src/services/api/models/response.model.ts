export interface IResponseList<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

export interface IResponseData<T> {
  data: T;
  meta: {};
}
