import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserService } from '../users/services/user.service';
import { RequestWithUser } from '../utils/helper.functions';
dotenv.config();

  export const authorizeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorizationHeader = req.header('Authorization');
      if (!authorizationHeader) {
        throw new Error('Authentication required');
      }
  
      const accessToken = authorizationHeader.replace('Bearer ', '');
  
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { sub: string };

      const userId = decoded.sub;

      const existingUser = await UserService.getUserById(userId);
      if (existingUser == null) {
        throw new Error("Access denied, unauthorized user");
      }
  
      (req as RequestWithUser).user = existingUser ;
      next()
    } catch (error) {
        next (error)
    }
  };
