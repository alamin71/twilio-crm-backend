import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyJWT(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid Token' });

  (req as any).user = decoded; // req.user তে ডাটা রাখা
  next();
};
