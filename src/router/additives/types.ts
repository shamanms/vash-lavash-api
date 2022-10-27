import {
  AdditivesModel,
  Middleware,
  TypedRequestBody,
  TypedRequestQuery
} from '../../types';

export type AdditivesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type AdditivesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<AdditivesModel> }>
>;

export type AdditivesPost = Middleware<TypedRequestBody<AdditivesModel>>;
