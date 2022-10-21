import { ValidationError } from '../../models/errors';
import { SalesGet, SalesGoogleImageUrlGet, SalesPost, SalesPut } from './types';
import { isArrayOfObjects, isObject } from '../../utils';

export const salesGet: SalesGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const salesPut: SalesPut = function (req, res, next) {
  const sales = req.body;

  if (!isObject(sales)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(sales).length < 1) {
    throw new ValidationError('Products not passed');
  }

  Object.values(sales).forEach((product) => {
    if (!isObject(product)) {
      throw new ValidationError('Incorrect sales');
    }
  });

  next();
};

export const salesPost: SalesPost = function (req, res, next) {
  const sales = req.body;
  if (!isArrayOfObjects(sales)) throw new ValidationError('Incorrect sales');

  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    isAvailable: 'boolean',
    img: 'string',
    description: 'string'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof sales[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape vacancy');
    }
  });

  next();
};

export const salesGoogleImageUrlGet: SalesGoogleImageUrlGet = (
  req,
  res,
  next
) => {
  const salesId = req.params.id;
  if (salesId.length < 4) {
    throw new ValidationError('Invalid product id');
  }

  if (!['jpeg', 'jpg'].includes(req.query.fileExtension)) {
    throw new ValidationError('Incorrect file extension');
  }

  next();
};
