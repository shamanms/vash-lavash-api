import {
  FileExtensionType,
  Middleware,
  SaleModel,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type SalesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type SalesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<SaleModel> }>
>;

interface GetRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type SalesPost = Middleware<TypedRequestBody<SaleModel>>;

export type SalesGoogleImageUrlGet = Middleware<
  GetRequest<{ id: string }, { fileExtension: FileExtensionType }>
>;
