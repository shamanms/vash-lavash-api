import db from '../models';

export const getProducts = async () => {
  const products = await db.products.get();
  return products
  //   .map(({ id, doc }) => ({
  //   id,
  //   data: doc.data(),
  // }));
}

export const addOrder = async (data): Promise<string> => {
  const timestamp = new Date().getTime();

  const order = await db.orders.add({
    ...data,
    timestamp,
  });

  return order.id;
}