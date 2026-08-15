import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

const generateToken = (userId: Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign({ id: userId.toString() }, secret, { expiresIn });
};

export default generateToken;
