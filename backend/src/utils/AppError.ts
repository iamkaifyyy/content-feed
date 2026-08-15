// A custom error class that carries an HTTP status code.
// Lets controllers do `throw new AppError("Content not found", 404)`
// and have the central error handler translate that into a consistent JSON response.
class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from real bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
