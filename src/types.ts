import { FieldPath, WhereFilterOp } from '@google-cloud/firestore';
import { Express, NextFunction, Response } from 'express';

//TODO: move to shared package
export interface Product {
  [key: string]: string | number | boolean | object;
  id: string;
  name: string;
  price: number;
  description: string;
  img: string;
  type: string;
  isAvailable: boolean;
  additives: string[];
}

export interface OrderModel {
  id?: string;
  phone: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  items: OrderedProduct[];
  timestamp: number;
  receivingTime: number;
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

export interface AdditivesModel {
  [key: string]: string | number | boolean;
  id: string;
  name: string;
  price: number;
  img: string;
  isAvailable: boolean;
}

export interface AdditivesProduct
  extends Pick<AdditivesModel, 'id' | 'name' | 'price'> {
  count: number;
}

export interface OrderedProduct extends Pick<Product, 'id' | 'name' | 'price'> {
  additives: AdditivesProduct[];
}

export interface OrderItem {
  productId: string;
  additives: {
    [key: string]: number;
  };
}

export interface OrderRequest {
  items: OrderItem[];
  phone: string;
  timestamp: number;
  receivingTime: number;
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
