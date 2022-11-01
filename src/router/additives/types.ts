import {
  AdditiveModel,
  FileExtensionType,
  Middleware,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type AdditivesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type AdditivesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<AdditiveModel> }>
>;

export type AdditivesPost = Middleware<TypedRequestBody<AdditiveModel>>;

interface GetRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type AdditiveGoogleImageUrlGet = Middleware<
  GetRequest<{ id: string }, { fileExtension: FileExtensionType }>
>;
