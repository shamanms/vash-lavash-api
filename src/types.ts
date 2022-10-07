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

export interface OrderedProduct extends Pick<Product, 'name' | 'price'> {
  id?: string;
  count: number;
}

export interface OrderModel {
  id?: string;
  phone: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  items: OrderedProduct[];
  timestamp: number;
  glovoOrderId?: string;
  pickUpCode?: string;
}

export interface VacancyModel {
  [key: string]: string | undefined | boolean | number;
  id?: string;
  position: string;
  requirements: string;
  salary: string;
  description: string;
  isAvailable: boolean;
  counter: number;
}

export interface UserModel {
  id?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface GlovoOrderRequest {
  order_id: string;
  order_time: string;
  customer: {
    phone_number: string;
  };
  products: GlovoProduct[];
  pick_up_code: string;
}

export interface GlovoProduct {
  name: string;
  price: number;
  quantity: number;
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
