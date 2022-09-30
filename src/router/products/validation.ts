import { ValidationError } from '../../models/errors';
import {
  ProductGoogleImageUrlGet,
  ProductsGet,
  ProductsPost,
  ProductsPut
} from './types';
import { isArrayOfObjects, isObject } from '../../utils';

export const productsGet: ProductsGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const productsPut: ProductsPut = function (req, res, next) {
  const products = req.body;

  if (!isObject(products)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(products).length < 1) {
    throw new ValidationError('Products not passed');
  }

  Object.values(products).forEach((product) => {
    if (!isObject(product)) {
      throw new ValidationError('Incorrect products');
    }
  });

  next();
};

export const productsPost: ProductsPost = function (req, res, next) {
  const products = req.body;
  if (!isArrayOfObjects(products))
    throw new ValidationError('Incorrect products');

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

export const productGoogleImageUrlGet: ProductGoogleImageUrlGet = (
  req,
  res,
  next
) => {
  const productId = req.params.id;
  if (productId.length < 4) {
    throw new ValidationError('Invalid product id');
  }

  if (!req.query.fileExtension.split(' ').includes('jpeg' || 'jpg')) {
    throw new ValidationError('Incorrect file extension');
  }

  next();
};
