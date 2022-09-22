import { ValidationError } from '../../models/errors';
import { ProductsGet, ProductsPut } from './types';

export const productsGet: ProductsGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const productsPut: ProductsPut = function (req, res, next) {
  const products = req.body;

  if (
    typeof products !== 'object' ||
    Array.isArray(products) ||
    products === null
  ) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(products).length < 1) {
    throw new ValidationError('Products not passed');
  }

  Object.values(products).forEach((product) => {
    if (
      typeof product !== 'object' ||
      product === null ||
      Array.isArray(product)
    ) {
      throw new ValidationError('Incorrect products');
    }
  });

  next();
};
