import { WhereFilterOp } from "@google-cloud/firestore";
//TODO: move to shared package
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  img: string;
  type: string;
}

export interface OrderedProduct extends Pick<Product, 'id' | 'name' | 'price'> {
  count: number;
}

export interface OrderModel {
  phone: string;
  totalPrice: number;
  isConfirmed: boolean;
  isCompleted: boolean;
  items: OrderedProduct[];
  timestamp: number;
}

export interface OrderItems {
  [key: number]: number;
}

export interface OrderRequest {
  items: OrderItems;
  phone: string;
  timestamp: number
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T
}

export type dbQuery = [string, WhereFilterOp, string | number | boolean];