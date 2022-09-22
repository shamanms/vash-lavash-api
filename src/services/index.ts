import db from '../models';
import { OrderService } from './order';
import { ProductsService } from './products';

export default {
  order: new OrderService(db.orders, db.products),
  products: new ProductsService(db.products)
};
