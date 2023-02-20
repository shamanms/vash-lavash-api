import { ValidationError } from '../../models/errors';
import {
  ComboMenusPost,
  ComboMenusGet,
  ComboMenusPut,
  ComboMenuGoogleImageUrlGet
} from './types';
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

  if (Object.keys(comboMenu).length < 1) {
    throw new ValidationError('ComboMenu not passed');
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
    img: 'string',
    price: 'number',
    steps: 'object',
    description: 'string'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof comboMenu[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape comboMenu');
    }
  });
  next();
};

export const comboMenuGoogleImageUrlGet: ComboMenuGoogleImageUrlGet = (
  req,
  res,
  next
) => {
  const comboMenuId = req.params.id;
  if (comboMenuId.length < 4) {
    throw new ValidationError('Invalid sale id');
  }

  if (!['jpeg', 'jpg', 'png'].includes(req.query.fileExtension)) {
    throw new ValidationError('Incorrect file extension');
  }

  next();
};
