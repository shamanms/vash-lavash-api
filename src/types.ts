import { FieldPath, WhereFilterOp } from '@google-cloud/firestore';
import { Express, NextFunction, Response } from 'express';

//TODO: move to shared package
export interface Product {
  [key: string]: string | number | boolean;
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
  orderStatus: OrderStatus;
  items: OrderedProduct[];
  timestamp: number;
}

export interface VacancyModel {
  [key: string]: string | undefined | boolean;
  id?: string;
  position: string;
  requirements: string;
  salary: string;
  description: string;
  isAvailable: boolean;
}

export interface UserModel {
  id?: string;
  username: string;
  password: string;
  role: string;
  loginDates: number[];
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

export interface TypedRequestParams<T> extends Express.Request {
  params: T;
}

export interface Middleware<R> {
  (req: R, res: Response, next: NextFunction): void;
}

export type dbQuery = [
  string | FieldPath,
  WhereFilterOp,
  string | number | boolean | string[]
];

export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier'
}

export enum OrderStatus {
  NOT_CONFIRMED = 'not_confirmed',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed'
}

export type fileExtensionType = 'jpeg' | 'jpg';
