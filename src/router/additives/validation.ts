import { ValidationError } from '../../models/errors';
import { AdditivesGet, AdditivesPost, AdditivesPut } from './types';
import { isObject } from '../../utils';

export const additivesGet: AdditivesGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const additivesPut: AdditivesPut = function (req, res, next) {
  const additives = req.body;

  if (!isObject(additives)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(additives).length < 1) {
    throw new ValidationError('Additive not passed');
  }

  Object.values(additives).forEach((additive) => {
    if (!isObject(additive)) {
      throw new ValidationError('Incorrect additives');
    }
  });

  next();
};

export const additivesPost: AdditivesPost = function (req, res, next) {
  const additive = req.body;

  if (!isObject(additive)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(additive).length < 1) {
    throw new ValidationError('Incorrect additive');
  }

  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    price: 'number',
    img: 'string',
    isAvailable: 'boolean'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof additive[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape additive');
    }
  });

  next();
};
