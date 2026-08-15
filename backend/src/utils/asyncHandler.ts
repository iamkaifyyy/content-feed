import { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps an async controller function so that any rejected promise (thrown error)
// is automatically forwarded to Express's error-handling middleware via next().
// Without this, every controller would need its own try/catch block.
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
