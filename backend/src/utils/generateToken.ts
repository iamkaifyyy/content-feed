import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

// Signs a JWT containing only the user's id. Keep the payload minimal —
// anything else (like role or email) would need to be kept in sync with
// the DB and could go stale until the token expires.
const generateToken = (userId: Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  const options: SignOptions = { expiresIn };
  return jwt.sign({ id: userId.toString() }, secret, options);
};

export default generateToken;
