import {
  ComboMenuModel,
  Middleware,
  TypedRequestBody,
  TypedRequestQuery
} from '../../types';

export type ComboMenusGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type ComboMenusPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<ComboMenuModel> }>
>;

export type ComboMenusPost = Middleware<TypedRequestBody<ComboMenuModel>>;
