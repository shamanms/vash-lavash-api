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
  // db.products.updateOne(products[0].id, products[0]);
  for(let product in products) {
    let newProduct = db.products.updateOne(products[product].id, products[product])
    return newProduct
  }
} 
  
  
export default {
  order: (orderRequest: Omit<OrderRequest, 'timestamp'>) =>
    new OrderService(db.orders, db.products, orderRequest)
};
