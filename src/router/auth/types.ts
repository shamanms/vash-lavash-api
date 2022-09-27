import { Middleware, TypedRequestBody } from '../../types';

export type LoginRequest = Middleware<
  TypedRequestBody<{ username: string; password: string }>
>;
