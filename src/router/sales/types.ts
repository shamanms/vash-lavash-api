import {
  FileExtensionType,
  Middleware,
  SalesModel,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type SalesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type SalesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<SalesModel> }>
>;

interface GetRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type SalesPost = Middleware<TypedRequestBody<SalesModel>>;

export type SalesGoogleImageUrlGet = Middleware<
  GetRequest<{ id: string }, { fileExtension: FileExtensionType }>
>;
