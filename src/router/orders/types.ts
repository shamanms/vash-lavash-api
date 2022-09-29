import {
  Middleware,
  OrderRequest,
  OrderStatus,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery
} from '../../types';

export type OrdersPost = Middleware<
  TypedRequestBody<Omit<OrderRequest, 'timestamp'>>
>;

export type OrdersGet = Middleware<TypedRequestBody<{}>>;

interface PutRequest<P, Q>
  extends TypedRequestQuery<Q>,
    TypedRequestParams<P> {}

export type OrdersPut = Middleware<
  PutRequest<{ id: string }, { status: OrderStatus }>
>;
