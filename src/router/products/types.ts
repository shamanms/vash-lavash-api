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

interface PutRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type ProductImagePut = Middleware<
  PutRequest<{ id: string }, { fileExtension: 'jpeg' | 'fileExtension' }>
>;
