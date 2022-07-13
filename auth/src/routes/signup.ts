import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { requestValidation } from "../middleware";
import { ErrorBadRequest } from "../utils";
import { UserModel } from "../models";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const isExist = await UserModel.findOne({ email });
    if (isExist) throw new ErrorBadRequest("Email already exist");

    const user = new UserModel({ email, password });
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

    res.status(201).send({
      data: {
        type: "user",
        id: user.id,
        attributes: user,
      },
    });
  }
);

export { router as signupRouter };
