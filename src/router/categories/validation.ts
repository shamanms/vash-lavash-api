import { CategoryPost, CategoryPut } from './types';
import {  isObject } from '../../utils';
import { ValidationError } from '../../models/errors';
import { AdditionalItemType } from '../../types';

export const categoryPut: CategoryPut = (req, res, next) => {
  const category = req.body;

  if (!isObject(category)) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(category).length < 1) {
    throw new ValidationError('Category not passed');
  }

  next();
};

export const categoryPost: CategoryPost = function (req, res, next) {
  const category = req.body;

  if (!isObject(category)) {
    throw new ValidationError('Invalid request');
  }

  if (!Array.isArray(category.additionalItems)) {
    throw new ValidationError('Invalid request');
  }

  const requiredKeys: { [key: string]: string } = {
    name: 'string',
    order: 'number',
    additionalItems: 'object'
  };

  Object.keys(requiredKeys).forEach((key) => {
    if (!(typeof category[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape category');
    }
  });

  for (const additionalItem of category.additionalItems) {
    const additionalItemTypes = Object.values(AdditionalItemType);

    if (!(typeof additionalItem.itemId === 'string')) {
      throw new ValidationError('Incorrect item id');
    }

    if (!additionalItemTypes.includes(additionalItem.type)) {
      throw new ValidationError('Incorrect type item');
    }
  }
  next();
};
