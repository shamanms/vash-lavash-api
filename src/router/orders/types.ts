import { Middleware, OrderRequest, TypedRequestBody } from '../../types';

export type OrdersPost = Middleware<
  TypedRequestBody<Omit<OrderRequest, 'timestamp'>>
>;

export type OrdersGet = Middleware<TypedRequestBody<{}>>;
