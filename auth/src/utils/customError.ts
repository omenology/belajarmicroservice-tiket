import { ValidationError } from "express-validator";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeError(): { titile?: string; message: string; source?: string }[];
}

export class ErrorValidationRequest extends CustomError {
  public statusCode = 400;
  constructor(private errors: ValidationError[], message?: string) {
    super(message || "Invalid request parameters");
    Object.setPrototypeOf(this, ErrorValidationRequest.prototype);
  }

  serializeError = () => {
    return this.errors.map((error) => {
      return {
        title: "Inavlid request parameters",
        message: error.msg,
        source: error.location + "/" + error.param,
      };
    });
  };
}

export class ErrorDatabaseConnection extends CustomError {
  public statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorDatabaseConnection.prototype);
  }

  serializeError = () => {
    return [{ title: "DB Error", message: this.message }];
  };
}

export class ErrorNotFound extends CustomError {
  public statusCode = 404;
  constructor(message?: string) {
    super(message || "Endpoint Not found");
    Object.setPrototypeOf(this, ErrorNotFound.prototype);
  }

  serializeError = () => {
    return [{ title: "Not found", message: "Endpoint Not found" }];
  };
}

export class ErrorBadRequest extends CustomError {
  public statusCode = 400;
  constructor(public message: string, code?: number) {
    super(message || "Bad Request");
    if (code) this.statusCode = code;
    Object.setPrototypeOf(this, ErrorBadRequest.prototype);
  }

  serializeError = () => {
    return [{ title: "Bad Request", message: this.message }];
  };
}
