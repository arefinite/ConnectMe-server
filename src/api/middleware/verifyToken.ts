import { config } from './../../config/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['auth-token']
  if (!token) return next(createHttpError(401, 'Unauthorized access'))

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY as string)
    req.userId = (decoded as JwtPayload).userId
    next()
  } catch (err) {
    next(createHttpError(401, 'Unauthorized access'))
  }
}
