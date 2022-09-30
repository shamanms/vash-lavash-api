import { LoginRequest } from './types';
import { ValidationError } from '../../models/errors';

export const loginPost: LoginRequest = function (req, res, next) {
  const user = req.body;
  if (!(typeof user === 'object' && user !== null && !Array.isArray(user))) {
    throw new ValidationError('Invalid request');
  }
  [
    typeof user.username !== 'string',
    typeof user.password !== 'string',
    user.username?.length < 5,
    user.password?.length < 5
  ].forEach((condition) => {
    if (condition) {
      throw new ValidationError('Invalid username or password');
    }
  });
  next();
};
