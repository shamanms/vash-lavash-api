import { ValidationError } from '../../models/errors';
import db from '../../models';
import { FieldPath } from '@google-cloud/firestore';
import { OrdersPost, OrdersPut } from './types';
import { isObject } from '../../utils';
import { OrderStatus } from '../../types';

export const ordersPost: OrdersPost = async function (req, res, next) {
  try {
    const order = req.body;
    if (Array.isArray(order)) {
      throw new ValidationError('Invalid body');
    }
    if (Object.keys(order).length < 1) {
      throw new ValidationError('Order is empty');
    }
    if (!isObject(order.items)) {
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

    if (typeof order.receivingTime !== 'number') {
      throw new ValidationError('Invalid format date');
    }

    const timeOpen = new Date().setHours(10, 0, 0);
    const timeClose = new Date().setHours(19, 0, 0);

    if (order.receivingTime < timeOpen || order.receivingTime > timeClose) {
      throw new ValidationError('Invalid time order');
    }

    const dateNow = new Date();
    const timeOpenTomorrow = new Date(
      dateNow.setDate(dateNow.getDate() + 1)
    ).setHours(10, 0, 0);
    const timeCloseTomorrow = new Date(
      dateNow.setDate(dateNow.getDate() + 1)
    ).setHours(19, 0, 0);

    if (
      order.receivingTime < timeOpenTomorrow ||
      order.receivingTime > timeCloseTomorrow
    ) {
      throw new ValidationError('Invalid time order');
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
  } catch (e) {
    next(e);
  }
};

export const orderPut: OrdersPut = (req, res, next) => {
  const status = req.query?.status;

  if (!Object.values(OrderStatus).includes(status)) {
    throw new ValidationError('Invalid status');
  }

  next();
};
