import db from '../models';
import { dbQuery, OrderRequest, Product } from '../types';
import { OrderService } from './order';

export const getProducts = async ({
  isAvailable
}: {
  isAvailable?: boolean;
}) => {
  let query;

  if (typeof isAvailable === 'boolean') {
    query = ['isAvailable', '==', isAvailable] as dbQuery;
  }

  return db.products.findMany(query);
};

export const addProducts = async (products: Product[]) =>
  db.products.insertMany(products);

export const updateProducts = async (products: Product[]) => {
  let updatedProducts = products.map(product => db.products.updateOne(product.id, product));
  return Promise.allSettled(updatedProducts)
} 
  
  
export default {
  order: (orderRequest: Omit<OrderRequest, 'timestamp'>) =>
    new OrderService(db.orders, db.products, orderRequest)
};
