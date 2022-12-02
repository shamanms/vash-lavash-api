import { AppConfigModel, Middleware, TypedRequestBody } from '../../types';
import { NextFunction, Response, Request } from 'express';

export type AppConfigGet = {
  (req: Request, res: Response, next: NextFunction): void;
};

export type SetIsOrderingAvailablePut = Middleware<
  TypedRequestBody<Pick<AppConfigModel, 'isOpen'>>
>;
