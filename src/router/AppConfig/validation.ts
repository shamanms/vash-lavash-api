import { SetIsOrderingAvailablePut } from './types';
import { ValidationError } from '../../models/errors';
import { isObject } from '../../utils';

export const setIsOrderingAvailablePut: SetIsOrderingAvailablePut = (
  req,
  res,
  next
) => {
  const setOpen = req.body;

  if (!isObject(setOpen)) {
    throw new ValidationError('Invalid request');
  }

  if (
    Object.keys(setOpen).length !== 1 ||
    Object.keys(setOpen).includes('isOpen')
  ) {
    throw new ValidationError('Invalid request');
  }
  Object.values(setOpen).forEach((val) => {
    if (typeof val !== 'boolean') {
      throw new ValidationError('Invalid request');
    }
  });

  next();
};
