import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation, isAuth, ErrorBadRequest, ErrorNotFound } from "@omnlgy/common";
import mongoose from "mongoose";

import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsClient } from "../utils/NatsClient";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";

const router = Router({ mergeParams: true });

const EXPIRATION_WINDOW_SECOUNDS = 15 * 60;

router.post(
  "/",
  isAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id format is not valid"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new ErrorNotFound("Ticket is not found");

    const isTicketReserved = await ticket.isReserved();
    if (isTicketReserved) throw new ErrorBadRequest("Ticket is already reserved");

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOUNDS);

    const order = Order.build({
      ticket,
      userId: req.decoded!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
    });
    await order.save();

    new OrderCreatedPublisher(natsClient.stan).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).json({
      data: {
        type: "order",
        id: order.id,
        attributes: order,
      },
    });
  }
);

export { router as newRoutes };
