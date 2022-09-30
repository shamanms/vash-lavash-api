import {
  Middleware,
  OrderStatus,
  Product,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type ProductsGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type ProductsPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<Product> }>
>;

export type ProductsPost = Middleware<TypedRequestBody<Product[]>>;

interface GetRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type ProductGoogleImageUrlGet = Middleware<
  GetRequest<{ id: string }, { fileExtension: 'jpeg' | 'jpg' }>
>;
