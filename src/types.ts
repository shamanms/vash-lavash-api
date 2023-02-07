import { FieldPath, WhereFilterOp } from '@google-cloud/firestore';
import { Express, NextFunction, Response } from 'express';

//TODO: move to shared package
export interface Product {
  [key: string]: string | number | boolean | object | undefined;
  id: string;
  name: string;
  price: number;
  description: string;
  img: string;
  type: string;
  isAvailable: boolean;
  additives: string[];
  labels: string[];
  create: CreateInfo;
  update?: UpdateInfo;
}

export interface OrderModel {
  id?: string;
  phone: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  items: OrderedProduct[];
  timestamp: number;
  receivingTime: number;
  update?: UpdateInfo;
  delivery: string | null;
}

export interface VacancyModel {
  [key: string]: string | undefined | boolean | number | object;
  id?: string;
  position: string;
  requirements: string;
  salary: string;
  description: string;
  isAvailable: boolean;
  counter: number;
  create: CreateInfo;
  update?: UpdateInfo;
}

export interface UserModel {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  loginDates: number[];
}

interface UpdateInfo {
  updatedBy: string;
  updatedAt: number;
}

interface CreateInfo {
  createdBy: string;
  createdAt: number;
}
export interface SaleModel {
  [key: string]: string | boolean | object | undefined;
  id: string;
  name: string;
  img: string;
  isAvailable: boolean;
  description: string;
  create: CreateInfo;
  update?: UpdateInfo;
}

export interface AdditiveModel {
  [key: string]: string | number | boolean | object | undefined;
  id: string;
  name: string;
  price: number;
  img: string;
  isAvailable: boolean;
  create: CreateInfo;
  update?: UpdateInfo;
}

export interface LabelsModel {
  [key: string]: string | object | undefined;
  id: string;
  name: string;
  color: string;
  create: CreateInfo;
  update?: UpdateInfo;
}

export interface AppConfigModel {
  isOpen: boolean;
}

interface ComboMenuSteps {
  step: number;
  products: string[];
}

export interface ComboMenuModel {
  [key: string]: string | boolean | object | undefined;
  id?: string;
  name: string;
  steps: ComboMenuSteps[];
  isAvailable: boolean;
  update?: UpdateInfo;
}

export interface Additive extends Pick<AdditiveModel, 'id' | 'name' | 'price'> {
  count: number;
}

export interface OrderedProduct extends Pick<Product, 'id' | 'name' | 'price'> {
  additives: Additive[];
}

export interface OrderItem {
  productId: string;
  additives?: {
    [key: string]: number;
  };
}
export interface OrderRequest
  extends Pick<OrderModel, 'phone' | 'receivingTime' | 'delivery'> {
  items: OrderItem[];
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

export type FileExtensionType = 'jpeg' | 'jpg';

export interface CategoryModel {
  id?: string;
  name: string;
  order: number;
}
