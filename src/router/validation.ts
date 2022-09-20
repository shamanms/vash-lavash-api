import { NextFunction } from 'express';
import { Product, TypedRequestBody, TypedRequestQuery } from '../types';

export const validateProductsPut = function (
  req: TypedRequestBody<Product[]>,
  res: any,
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
  res: any,
  next: NextFunction
) {
  const { isAvailable } = req.query;
  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    res.status(400).send('Invalid parameter');
  }

  next();
};
