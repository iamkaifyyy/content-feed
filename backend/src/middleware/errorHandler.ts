import { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from "express";
import AppError from "../utils/AppError";

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  errors?: Record<string, { message: string }>;
}

// Central place where every error in the app ends up (via next(err) or asyncHandler).
// This guarantees every error response has the same JSON shape, which makes the
// API predictable for the frontend team.
export const errorHandler: ErrorRequestHandler = (
  err: MongoError & AppError,
  req: Request,
  res: Response,
  // next is required for Express to recognise this as a 4-arg error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode: number = (err as AppError).statusCode || 500;
  let message: string = err.message || "Internal Server Error";

  // Mongoose bad ObjectId (e.g. GET /feed/not-a-valid-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose duplicate key error (e.g. duplicate bookmark or duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {}).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error (missing/invalid required fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(", ");
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Catches requests to routes that don't exist at all.
export const notFound: RequestHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
