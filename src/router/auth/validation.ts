import { LoginRequest } from './types';
import { ValidationError } from '../../models/errors';

export const loginPost: LoginRequest = async function (req, res, next) {
  const user = req.body;
  if (typeof user !== 'object' || user === null || Array.isArray(user)) {
    throw new ValidationError('Invalid request');
  }
  if (typeof user.username !== 'string' && typeof user.password !== 'string') {
    throw new ValidationError('Invalid username or password');
  }
  next();
};
