import { ValidationError } from '../../models/errors';
import { OrdersPost, OrdersPut } from './types';
import { OrderStatus } from '../../types';
import services from '../../services';

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

    for (const item of order.items) {
      const orderAdditiveValues = Object.values(item.additives);
      const isOrderAdditiveValuesValid = orderAdditiveValues.every(
        (value) => typeof value === 'number'
      );

      if (
        typeof item.productId !== 'string' ||
        typeof item.count !== 'number' ||
        !isOrderAdditiveValuesValid
      ) {
        throw new ValidationError('Invalid order item');
      }
    }

    const phoneRegex = /^((\(0\d{2}\)))[ ]\d{3}[-]\d{2}[-]\d{2}$/;

    if (!(typeof order.phone === 'string' && phoneRegex.test(order.phone))) {
      throw new ValidationError('Invalid phone number');
    }

    if (typeof order.receivingTime !== 'number') {
      throw new ValidationError('Invalid format date');
    }

    const receivingDate = new Date(order.receivingTime);
    const nowDate = new Date();

    if (
      receivingDate.getDay() < nowDate.getDay() ||
      receivingDate.getDay() > nowDate.getDay() + 1
    ) {
      throw new ValidationError('Invalid order date');
    }

    // TODO: check with UTC
    const timeOpen = 10;
    const timeClose = 19;

    if (
      receivingDate.getHours() < timeOpen ||
      receivingDate.getHours() >= timeClose
    ) {
      throw new ValidationError('Invalid order time');
    }

    for (const item of order.items) {
      const additives = await services.additives.getAdditives({
        isAvailable: true
      });
      const isAdditivesValid = additives.some(({ id }) =>
        Object.keys(item.additives).includes(id)
      );

      const products = await services.products.getProducts({
        isAvailable: true
      });
      const isProductsValid = products.some(({ id }) => id === item.productId);
      if (!isProductsValid) {
        throw new ValidationError('Products not found');
      } else if (!isAdditivesValid) {
        throw new ValidationError('Additives not found');
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
