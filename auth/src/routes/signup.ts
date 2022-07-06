import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ErrorValidationRequest, ErrorDatabaseConnection } from "../utils/customError";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ErrorValidationRequest(errors.array());

    // throw new ErrorDatabaseConnection("Database connection error");

    res.status(200).send("OK signup");
  }
);

export { router as signupRouter };
