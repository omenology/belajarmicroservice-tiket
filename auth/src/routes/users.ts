import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { requestValidation, isAuth, ErrorBadRequest } from "@omnlgy/common";
import { PasswordHooks } from "../utils/passwordHooks";
import { UserModel } from "../models";

const router = Router({ mergeParams: true });

router.post(
  "/signup",
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

router.post(
  "/signin",
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

router.get("/currentuser", isAuth, async (req: Request, res: Response) => {
  res.status(200).send({
    data: {
      type: "user",
      attributes: req.decoded,
    },
  });
});

router.post("/signout", async (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send({
    data: {
      type: "user",
      attributes: {},
    },
  });
});

export { router as userRoutes };
