import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ErrorValidationRequest } from "../utils/customError";

export const requestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ErrorValidationRequest(errors.array());

  next();
};
