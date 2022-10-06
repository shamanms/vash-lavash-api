import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { accessSecretVersion } from '../../services/jwt';
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
    const jwtSecret = await accessSecretVersion();
    const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);

    if (typeof decoded !== 'object' || decoded.role !== UserRole.ADMIN) {
      return res.status(403).send({ message: 'Not Allowed' });
    }

    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
};
