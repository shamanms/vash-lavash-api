import { NextFunction, Response } from 'express';
import {
  OrderRequest,
  Product,
  TypedRequestBody,
  TypedRequestQuery
} from '../types';

export const validateProductsPut = function (
  req: TypedRequestBody<Product[]>,
  res: Response,
  next: NextFunction
) {
  const products = req.body;
  if (!Array.isArray(products)) return res.status(400).send('Invalid request');

  if (products.length < 1) return res.status(400).send('Products not passed');

  const isProductsValid = products.every((product) => {
    return (
      typeof product === 'object' &&
      product !== null &&
      !Array.isArray(product) &&
      typeof product?.id === 'string'
    );
  });

  if (!isProductsValid) return res.status(400).send('Invalid product');

  next();
};

export const validateProductsGet = function (
  req: TypedRequestQuery<{ isAvailable: 'true' | 'false' }>,
  res: Response,
  next: NextFunction
) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    return res.status(400).send('Invalid parameter');
  }

  next();
};

export const validateOrdersPost = function (
  req: TypedRequestBody<Omit<OrderRequest, 'timestamp'>>,
  res: Response,
  next: NextFunction
) {
  const order = req.body;
  if (Object.keys(order).length < 1) {
    return res.status(400).send('Order is empty');
  }

  if (
    typeof order.items !== 'object' ||
    order.items === null ||
    Array.isArray(order.items)
  ) {
    return res.status(400).send('Invalid order');
  }

  const orderValues = Object.values(order.items);
  const isOrderValuesValid = orderValues.every(
    (value) => typeof value === 'number'
  );

  if (orderValues.length < 1 || !isOrderValuesValid) {
    return res.status(400).send('Invalid order item');
  }

  const phoneRegex = /^((\(0\d{2}\)))[ ]\d{3}[-]\d{2}[-]\d{2}$/;

  if (!(typeof order.phone === 'string' && phoneRegex.test(order.phone))) {
    return res.status(400).send('Invalid phone number');
  }

  next();
};
