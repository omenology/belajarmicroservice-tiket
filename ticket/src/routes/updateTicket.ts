import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation, isAuth, ErrorNotFound, ErrorBadRequest } from "@omnlgy/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/TicketUpdatedPublisher";
import { natsClient } from "../utils/NatsClient";

const router = Router({ mergeParams: true });

router.put(
  "/api/tickets/:id",
  isAuth,
  [body("title").notEmpty().withMessage("title required"), body("price").notEmpty().isFloat({ gt: 0 }).withMessage("Price have to greater than 0")],
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new ErrorNotFound();
    if (ticket?.orderId) throw new ErrorBadRequest("reserverd ticket can not edited", 401);
    if (ticket.userId != req.decoded?.id) throw new ErrorBadRequest("Unauthorized", 401);

    ticket.set({ title, price });
    await ticket.save();

    new TicketUpdatedPublisher(natsClient.stan).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).json({
      data: {
        type: "ticket",
        id: req.params.id,
        attributes: ticket,
      },
    });
  }
);

export { router as updateRoutes };
