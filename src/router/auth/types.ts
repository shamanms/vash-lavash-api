import { Middleware, TypedRequestBody, TypedRequest } from '../../types';

export type LoginRequest = Middleware<
  TypedRequestBody<{ username: string; password: string }>
>;

export interface SystemQuery {
  auth: string;
}
export type SystemRequest = Middleware<TypedRequest<{}, SystemQuery, {}>>;
