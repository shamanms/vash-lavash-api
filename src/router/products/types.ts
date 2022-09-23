import {
  Middleware,
  Product,
  TypedRequestBody,
  TypedRequestQuery
} from '../../types';

export type ProductsGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type ProductsPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<Product> }>
>;

export type ProductsPost = Middleware<TypedRequestBody<Product[]>>;
