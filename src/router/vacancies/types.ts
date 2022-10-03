import {
  Middleware,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery,
  VacancyModel
} from '../../types';

export type VacanciesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type VacanciesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<VacancyModel> }>
>;

export type VacanciesPost = Middleware<TypedRequestBody<VacancyModel>>;

export type VacancyCountPut = Middleware<TypedRequestParams<string>>;
