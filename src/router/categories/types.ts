import { Express } from 'express';
import {
  CategoryModel,
  Middleware,
  TypedRequestBody,
  TypedRequestParams
} from '../../types';

export type CategoriesGet = Middleware<Express.Request>;

interface PutRequest<P, B> extends TypedRequestParams<P>, TypedRequestBody<B> {}
export type CategoryPut = Middleware<
  PutRequest<{ categoryId: string }, Partial<CategoryModel>>
>;

export type CategoryPost = Middleware<TypedRequestBody<CategoryModel>>;
