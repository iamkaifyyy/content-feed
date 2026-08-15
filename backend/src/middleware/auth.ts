import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import User, { IUser } from "../models/User";

// Extend Express Request to include the authenticated user.
// This declaration merging lets every downstream handler access req.user typed as IUser.
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

// Verifies the JWT from the Authorization header and attaches the
// authenticated user to req.user. Every "protected" route uses this.
export const protect: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Not authorized, no token provided", 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch {
      throw new AppError("Not authorized, token invalid or expired", 401);
    }

    // Fetch the user fresh from the DB (not just trusting the token payload)
    // so that a deleted/deactivated user can't keep using an old valid token.
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("Not authorized, user no longer exists", 401);
    }

    req.user = user;
    next();
  }
);
