import { FieldPath, WhereFilterOp } from '@google-cloud/firestore';
import { Express, NextFunction, Response } from 'express';

//TODO: move to shared package
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  img: string;
  type: string;
  isAvailable: boolean;
}

export interface OrderedProduct extends Pick<Product, 'id' | 'name' | 'price'> {
  count: number;
}

export interface OrderModel {
  id?: string;
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
  timestamp: number;
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T;
}

export interface Middleware<R> {
  (req: R, res: Response, next: NextFunction): void;
}

export type dbQuery = [
  string | FieldPath,
  WhereFilterOp,
  string | number | boolean | string[]
];
