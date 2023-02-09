import {
  ComboMenuModel,
  FileExtensionType,
  Middleware,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type ComboMenusGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type ComboMenusPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<ComboMenuModel> }>
>;

interface GetRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type ComboMenusPost = Middleware<TypedRequestBody<ComboMenuModel>>;

export type ComboMenuGoogleImageUrlGet = Middleware<
  GetRequest<{ id: string }, { fileExtension: FileExtensionType }>
>;
