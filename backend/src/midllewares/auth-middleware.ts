import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserService } from "../users/services/user.service";
import {
  errorHandler,
  RequestWithUser,
  verifyAccessToken,
} from "../utils/helper.functions";
dotenv.config();

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
      return errorHandler(res, "Authentication required", 401);
    }

    const secretKey = process.env.JWT_SECRET;

    const accessToken = authorizationHeader.replace("Bearer ", "");

    const data = verifyAccessToken(accessToken, secretKey!);

    if (!data) return errorHandler(res, "Token expired");

    const currentTime = Math.floor(Date.now() / 1000);

    if (data!.exp && currentTime > data!.exp)
      return errorHandler(res, "Token expired", 403);

    const existingUser = await UserService.getUserById(data.userid);

    if (!existingUser) {
      return errorHandler(res, "Access denied, unauthorized user", 401);
    }

    (req as RequestWithUser).user = existingUser;
    next();
  } catch (error) {
    next(error);
  }
};
