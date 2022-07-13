import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { ErrorValidationRequest, ErrorBadRequest } from "../utils/customError";
import { User } from "../models/user";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ErrorValidationRequest(errors.array());
    const { email, password } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) throw new ErrorBadRequest("Email already exist");

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      token,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
