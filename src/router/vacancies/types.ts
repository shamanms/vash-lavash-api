import {
  Middleware,
  TypedRequestBody,
  TypedRequestQuery,
  VacancyModel
} from '../../types';

export type VacanciesGet = Middleware<
  TypedRequestQuery<{ isAvailable: 'true' | 'false' }>
>;

export type VacanciesPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<VacancyModel> }>
>;

export type VacanciesPost = Middleware<TypedRequestBody<VacancyModel[]>>;
