import { Request, Response, NextFunction } from "express";
import { ErrorDatabaseConnection, ErrorValidationRequest } from "../utils/customError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorValidationRequest) {
    const errorFormated = err.errors.map((error) => {
      console.log(error);
      return {
        title: "Request validation error",
        message: error.msg,
        source: "/" + error.location + "/" + error.param,
      };
    });
    return res.status(400).send({ errors: errorFormated });
  }

  if (err instanceof ErrorDatabaseConnection) {
    return res.status(500).send({ errors: [{ title: "DB Error", message: err.message }] });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
