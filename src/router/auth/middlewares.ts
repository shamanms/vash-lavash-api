import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types';

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
