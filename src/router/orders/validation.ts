import { ValidationError } from '../../models/errors';
import db from '../../models';
import { FieldPath } from '@google-cloud/firestore';
import { OrdersPost } from './types';

export const ordersPost: OrdersPost = async function (req, res, next) {
  const order = req.body;
  if (Array.isArray(order)) {
    throw new ValidationError('Invalid body');
  }
  if (Object.keys(order).length < 1) {
    throw new ValidationError('Order is empty');
  }
  if (
    typeof order.items !== 'object' ||
    order.items === null ||
    Array.isArray(order.items)
  ) {
    throw new ValidationError('Invalid order');
  }

  const orderValues = Object.values(order.items);
  const isOrderValuesValid = orderValues.every(
    (value) => typeof value === 'number'
  );

  if (orderValues.length < 1 || !isOrderValuesValid) {
    throw new ValidationError('Invalid order item');
  }

  const phoneRegex = /^((\(0\d{2}\)))[ ]\d{3}[-]\d{2}[-]\d{2}$/;

  if (!(typeof order.phone === 'string' && phoneRegex.test(order.phone))) {
    throw new ValidationError('Invalid phone number');
  }

  const products = await db.products.findMany([
    FieldPath.documentId(),
    'in',
    Object.keys(order.items)
  ]);
  const productInStock = products
    .filter((product) => {
      if (product.isAvailable) return product;
    })
    .map(({ id }) => id);
  const isProductsValid = Object.keys(order.items).every((id) => {
    return productInStock.includes(id);
  });
  if (!isProductsValid) {
    throw new ValidationError('Products not found');
  }

  next();
};
