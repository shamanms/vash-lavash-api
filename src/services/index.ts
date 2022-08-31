import db from '../models';
import { Order, Product } from "../types";

export const getProducts = async () => db.products.findMany();

export const addProducts = async (products: Product[]) => db.products.insertMany(products);

export const addOrder = async (data: Omit<Order, 'timestamp'>): Promise<string> => {
  const timestamp = new Date().getTime();

  const order = await db.orders.insertOne({
    ...data,
    timestamp,
  });

  return order.id;
};