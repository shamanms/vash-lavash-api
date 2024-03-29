import { FieldPath } from '@google-cloud/firestore';
import { ValidationError } from '../../models/errors';
import { OrdersPost, OrdersPut } from './types';
import { OrderStatus } from '../../types';
import { isArrayOfObjects, isObject } from '../../utils';
import db from '../../models';
import { getDateWithTimezone } from '../../utils/dateTimeFormatter';

export const ordersPost: OrdersPost = async function (req, res, next) {
  try {
    const order = req.body;
    if (Array.isArray(order)) {
      throw new ValidationError('Invalid body');
    }
    if (Object.keys(order).length < 1) {
      throw new ValidationError('Order is empty');
    }
    if (!Array.isArray(order.items)) {
      throw new ValidationError('Invalid order');
    }
    if (!isArrayOfObjects(order.items)) {
      throw new ValidationError('Invalid order items');
    }

    if (order.items.length < 1 && !order.comboMenus) {
      throw new ValidationError('Invalid order');
    }

    const phoneRegex = /^((\(0\d{2}\)))[ ]\d{3}[-]\d{2}[-]\d{2}$/;

    if (!(typeof order.phone === 'string' && phoneRegex.test(order.phone))) {
      throw new ValidationError('Invalid phone number');
    }

    if (typeof order.receivingTime !== 'number') {
      throw new ValidationError('Invalid date format');
    }

    const receivingDate = getDateWithTimezone(order.receivingTime);
    const nowDate = getDateWithTimezone(Date.now());

    if (
      receivingDate.getDay() < nowDate.getDay() ||
      receivingDate.getDay() > nowDate.getDay() + 1
    ) {
      throw new ValidationError('Invalid order date');
    }

    const timeOpen = 10;
    const timeClose = 19;

    if (
      receivingDate.getHours() < timeOpen ||
      receivingDate.getHours() >= timeClose
    ) {
      throw new ValidationError('Invalid order time');
    }

    for (const item of order.items) {
      if ('additives' in item && !isObject(item.additives)) {
        throw new ValidationError('Invalid order item');
      }

      if (item.additives) {
        const orderAdditiveValues = Object.values(item.additives);
        const isOrderAdditiveValuesValid = orderAdditiveValues.every(
          (value) => typeof value === 'number'
        );

        if (typeof item.productId !== 'string' || !isOrderAdditiveValuesValid) {
          throw new ValidationError('Invalid order item');
        }
        const product = await db.products.findOneById(item.productId);
        if (!product || !product.isAvailable) {
          throw new ValidationError('Products not found');
        }
        const additives = await db.additives.findMany([
          FieldPath.documentId(),
          'in',
          Object.keys(item.additives)
        ]);
        const additiveInStock = additives
          .filter(({ isAvailable }) => isAvailable)
          .map(({ id }) => id);
        const isAdditivesValid = Object.keys(item.additives).every((id) => {
          return additiveInStock.includes(id);
        });
        if (!isAdditivesValid) {
          throw new ValidationError('Additives not found');
        }
      }
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
