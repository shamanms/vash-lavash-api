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

  if (Object.keys(setOpen).length !== 1 || !('isOpen' in setOpen)) {
    throw new ValidationError('Invalid request');
  }

  if (typeof setOpen.isOpen !== 'boolean') {
    throw new ValidationError('Invalid value');
  }

  next();
};
