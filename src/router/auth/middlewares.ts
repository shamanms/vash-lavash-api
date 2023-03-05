import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types';
import { SystemRequest } from './types';

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.headers?.authorization;

  if (!token || !token.includes('Bearer')) {
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET || ''
    );

    if (typeof decoded !== 'object' || decoded.role !== UserRole.ADMIN) {
      return res.status(403).send({ message: 'Not Allowed' });
    }

    req.user = {
      id: decoded?.id,
      role: decoded?.role
    };
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
};

export const systemAuth: SystemRequest = async (req, res, next) => {
  const token = req?.query?.auth;

  if (!token) {
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');

    if (
      typeof decoded !== 'object' ||
      ![UserRole.SYSTEM, UserRole.ADMIN].includes(decoded.role)
    ) {
      return res.status(403).send({ message: 'Not Allowed' });
    }

    req.user = {
      id: decoded?.id,
      role: decoded?.role
    };
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
};
