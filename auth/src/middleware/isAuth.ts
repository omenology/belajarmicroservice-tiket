import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorBadRequest } from "../utils";

interface payloadUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      decoded?: payloadUser;
    }
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.token) throw new ErrorBadRequest("Unauthorized", 401);
  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_KEY!) as payloadUser;
    req.decoded = decoded;
    next();
  } catch (error) {
    throw new ErrorBadRequest("Invalid credentials");
  }
};
