import {
  Middleware,
  OrderRequest,
  OrderStatus,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type OrdersPost = Middleware<TypedRequestBody<OrderRequest>>;

export type OrdersGet = Middleware<TypedRequestBody<{}>>;

interface PutRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type OrdersPut = Middleware<
  PutRequest<{ id: string }, { status: OrderStatus }>
>;
