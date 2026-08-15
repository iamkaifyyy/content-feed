import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch {
      throw new AppError("Invalid or expired session token", 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("User account not found", 401);
    }

    req.user = user;
    next();
  }
);
