import db from '../models';
import { dbQuery, Order, Product } from "../types";

export const getProducts = async ({ isAvailable }: { isAvailable?: boolean }) => {
  let query;

  if (typeof isAvailable === "boolean") {
    query = ['isAvailable', '==', isAvailable] as dbQuery;
  }

  return db.products.findMany(query);
}

export const addProducts = async (products: Product[]) => db.products.insertMany(products);

export const addOrder = async (data: Omit<Order, 'timestamp'>): Promise<string> => {
  const timestamp = new Date().getTime();

  const order = await db.orders.insertOne({
    ...data,
    timestamp,
  });

  return order.id;
};