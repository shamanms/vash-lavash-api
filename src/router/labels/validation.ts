import { isObject } from '../../utils';
import { ValidationError } from '../../models/errors';
import { LabelPost, LabelsPut } from './types';

export const labelsPut: LabelsPut = function (req, res, next) {
  const labels = req.body;

  if (!isObject(labels)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(labels).length < 1) {
    throw new ValidationError('Label not passed');
  }

  Object.values(labels).forEach((additive) => {
    if (!isObject(additive)) {
      throw new ValidationError('Incorrect labels');
    }
  });

  next();
};

export const labelPost: LabelPost = function (req, res, next) {
  const label = req.body;

  if (!isObject(label)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(label).length < 1) {
    throw new ValidationError('Incorrect label');
  }

  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    color: 'string'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof label[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape label');
    }
  });

  next();
};
