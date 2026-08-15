import { Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

// @route  POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are all required", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  // Password hashing happens automatically in the User model's pre-save hook.
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id as unknown as string);

  res.status(201).json({
    success: true,
    data: {
      user: { id: user._id, _id: user._id, name: user.name, email: user.email },
      token,
    },
  });
});

// @route  POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // .select("+password") because the schema excludes password by default.
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  // Deliberately vague message: don't reveal whether it was the email or the
  // password that was wrong, to avoid leaking which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id as unknown as string);

  res.status(200).json({
    success: true,
    data: {
      user: { id: user._id, _id: user._id, name: user.name, email: user.email },
      token,
    },
  });
});
