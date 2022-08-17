import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation, isAuth } from "@omnlgy/common";
import { Ticket } from "../models/ticket";

const router = Router({ mergeParams: true });

router.post(
  "/api/tickets",
  isAuth,
  [body("title").notEmpty(), body("price").notEmpty().isFloat({ gt: 0 }).withMessage("Price have to greater than 0")],
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.decoded?.id!,
    });
    await ticket.save();
    res.status(201).json({
      data: {
        type: "ticket",
        id: ticket.id,
        attributes: ticket,
      },
    });
  }
);

export { router as newRoutes };
