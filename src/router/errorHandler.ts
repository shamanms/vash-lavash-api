import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../models/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // Required parameter for express error handler middleware: https://expressjs.com/en/guide/using-middleware.html
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    return res.status(err.code).send(err.message);
  }

  console.error(err.stack);
  return res.status(500).send('Internal Server Error');
};
