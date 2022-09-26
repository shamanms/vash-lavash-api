import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { accessSecretVersion } from '../../services/jwt';

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token || !token.includes('Bearer')) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const jwtSecret = await accessSecretVersion();
    const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);

    if (typeof decoded !== 'object' || decoded.role !== 'admin') {
      return res.status(403).send('Not Allowed');
    }

    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};
