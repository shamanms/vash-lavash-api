import { ValidationError } from '../../models/errors';
import { ComboMenusPost, ComboMenusGet, ComboMenusPut } from './types';
import { isArrayOfObjects, isObject } from '../../utils';

export const comboMenusGet: ComboMenusGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const comboMenusPut: ComboMenusPut = function (req, res, next) {
  const comboMenu = req.body;

  if (!isObject(comboMenu)) {
    throw new ValidationError('Invalid request');
  }

  next();
};

export const comboMenusPost: ComboMenusPost = function (req, res, next) {
  const comboMenu = req.body;

  if (!isObject(comboMenu)) {
    throw new ValidationError('Invalid request');
  }

  if (!Array.isArray(comboMenu.steps)) {
    throw new ValidationError('Invalid request');
  }
  if (!isArrayOfObjects(comboMenu.steps)) {
    throw new ValidationError('Invalid request');
  }
  if (comboMenu.steps.length <= 0) {
    throw new ValidationError('Invalid request');
  }
  for (const steps of comboMenu.steps) {
    if (!steps.products.every((value) => typeof value === 'string')) {
      throw new ValidationError('Incorrect products id');
    }
  }
  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    isAvailable: 'boolean',
    price: 'number',
    steps: 'object'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof comboMenu[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape comboMenu');
    }
  });
  next();
};
