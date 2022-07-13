import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { requestValidation } from "../middleware";
import { ErrorBadRequest, PasswordHooks } from "../utils";
import { UserModel } from "../models";

const router = Router({ mergeParams: true });

router.post(
  "/",
  [body("email").isEmail().withMessage("Please enter a valid email"), body("password").trim().notEmpty().withMessage("Password required")],
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) throw new ErrorBadRequest("Invalid credentials");

    const isMatch = await PasswordHooks.comparePassword(user.password, password);
    if (!isMatch) throw new ErrorBadRequest("Invalid credentials");

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

    res.status(200).send({
      data: {
        type: "user",
        id: user.id,
        attributes: user,
      },
    });
  }
);

export { router as signinRouter };
