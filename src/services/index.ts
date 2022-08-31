import db from '../models';

export const getProducts = async () => db.products.findMany();

export const addOrder = async (data): Promise<string> => {
  const timestamp = new Date().getTime();

  const order = await db.orders.insert({
    ...data,
    timestamp,
  });

  return order.id;
}