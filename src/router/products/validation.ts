import { ValidationError } from '../../models/errors';
import { ProductsGet, ProductsPost, ProductsPut } from './types';

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

export const productsPost: ProductsPost = function (req, res, next) {
  const products = req.body;
  if (!Array.isArray(products)) {
    throw new ValidationError('Invalid request');
  }

  if (products.length < 1) {
    throw new ValidationError('Invalid request');
  }
  products.forEach((product) => {
    if (
      !(
        typeof product === 'object' &&
        product !== null &&
        !Array.isArray(product)
      )
    ) {
      throw new ValidationError('Incorrect products');
    }
  });
  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    price: 'number',
    type: 'string',
    isAvailable: 'boolean',
    img: 'string',
    description: 'string'
  };

  products.forEach((product) => {
    Object.keys(requiredKeys).forEach((key) => {
      if (!(typeof product[key] === requiredKeys[key])) {
        throw new ValidationError('Incorrect shape products');
      }
    });
  });

  next();
};
