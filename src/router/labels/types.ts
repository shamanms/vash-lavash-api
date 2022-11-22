import { LabelsModel, Middleware, TypedRequestBody } from '../../types';

export type LabelsGet = Middleware<any>;

export type LabelsPut = Middleware<
  TypedRequestBody<{ [key: string]: Partial<LabelsModel> }>
>;

export type LabelPost = Middleware<TypedRequestBody<LabelsModel>>;
