import { NextFunction, Response } from 'express';
import {
  OrderRequest,
  Product,
  TypedRequestBody,
  TypedRequestQuery
} from '../types';
import { ValidationError } from '../models/errors';

export const validateProductsPut = function (
  req: TypedRequestBody<Product[]>,
  res: Response,
  next: NextFunction
) {
  const products = req.body;
  if (!Array.isArray(products)) throw new ValidationError('Invalid request');

  if (products.length < 1) throw new ValidationError('Products not passed');

  const isProductsValid = products.every((product) => {
    return (
      typeof product === 'object' &&
      product !== null &&
      !Array.isArray(product) &&
      typeof product?.id === 'string'
    );
  });

  if (!isProductsValid) throw new ValidationError('Invalid product');

  next();
};

export const validateProductsGet = function (
  req: TypedRequestQuery<{ isAvailable: 'true' | 'false' }>,
  res: Response,
  next: NextFunction
) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};
// TODO check product id in database
export const validateOrdersPost = function (
  req: TypedRequestBody<Omit<OrderRequest, 'timestamp'>>,
  res: Response,
  next: NextFunction
) {
  const order = req.body;
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

  next();
};
