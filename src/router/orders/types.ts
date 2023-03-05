import {
  Middleware,
  OrderRequest,
  OrderStatus,
  TypedRequestBody,
  TypedRequest
} from '../../types';
import { SystemQuery } from '../auth/types';

export type OrdersPost = Middleware<TypedRequestBody<OrderRequest>>;

export type OrdersGet = Middleware<TypedRequestBody<{}>>;

interface PutQuery extends SystemQuery {
  status: OrderStatus;
}
export type OrdersPut = Middleware<TypedRequest<{ id: string }, PutQuery, {}>>;
