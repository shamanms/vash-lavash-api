import db from '../models';
import { OrderRequest } from '../types';
import { OrderService } from './order';
import { ProductsService } from './products';

export default {
  order: (orderRequest: Omit<OrderRequest, 'timestamp'>) =>
    new OrderService(db.orders, db.products, orderRequest),
  products: new ProductsService(db.products)
};
