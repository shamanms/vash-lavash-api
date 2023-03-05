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
  comboMenus: OrderedComboMenu[];
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
  isActive: boolean;
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
  stepName: string;
  multiProducts: boolean;
  multiOneProduct: boolean;
  maxProducts: number | null;
  products: string[];
}

export interface ComboMenuModel {
  [key: string]: string | boolean | object | number | undefined;
  id?: string;
  name: string;
  img: string;
  price: number;
  steps: ComboMenuSteps[];
  description: string;
  isAvailable: boolean;
  fixedPrice: boolean;
  isConstructor: boolean; // products or additives
  update?: UpdateInfo;
}

export interface OrderedAdditive
  extends Pick<AdditiveModel, 'id' | 'name' | 'price'> {
  count: number;
}

export interface OrderedProduct extends Pick<Product, 'id' | 'name' | 'price'> {
  additives: OrderedAdditive[];
}

export interface OrderedComboMenu
  extends Pick<ComboMenuModel, 'id' | 'name' | 'price'> {
  products:
    | Pick<Product, 'id' | 'name' | 'price'>[]
    | Pick<AdditiveModel, 'id' | 'name' | 'price'>[];
}
export interface OrderItem {
  productId: string;
  additives?: {
    [key: string]: number;
  };
}
export interface OrderComboMenu {
  comboMenuId: string;
  isConstructor: boolean;
  fixedPrice: boolean;
  products: string[];
}
export interface OrderRequest
  extends Pick<OrderModel, 'phone' | 'receivingTime' | 'delivery'> {
  items: OrderItem[];
  comboMenus?: OrderComboMenu[];
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

export interface TypedRequest<P, Q, B>
  extends TypedRequestParams<P>,
    TypedRequestQuery<Q>,
    TypedRequestBody<B> {}

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
  CASHIER = 'cashier',
  SYSTEM = 'system'
}

export enum OrderStatus {
  NOT_CONFIRMED = 'not_confirmed',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed'
}

export type FileExtensionType = 'jpeg' | 'jpg' | 'png';

export enum AdditionalItemType {
  comboMenu = 'comboMenu',
  sales = 'sales'
}

export interface AdditionalItem {
  type: AdditionalItemType;
  itemId: string;
}

export interface CategoryModel {
  [key: string]: string | object | number | undefined;
  id?: string;
  name: string;
  order: number;
  additionalItems: AdditionalItem[];
}
