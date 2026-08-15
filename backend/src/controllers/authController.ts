import { Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const token = generateToken(user._id as unknown as string);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email?.trim() || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id as unknown as string);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});
