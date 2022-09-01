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

export interface OrderItems {
  [key: number]: number;
}

export interface Order {
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