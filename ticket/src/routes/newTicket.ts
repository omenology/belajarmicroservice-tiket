import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation, isAuth } from "@omnlgy/common";
import { Ticket } from "../models/ticket";
import { natsClient } from "../utils/NatsClient";
import { TicketCreatedPublisher } from "../events/publishers/TicketCreatedPublisher";

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
    const a = new TicketCreatedPublisher(natsClient.stan)
    .publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
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
