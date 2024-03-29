import { Router, Request, Response } from "express";
import { isAuth, ErrorNotFound, ErrorBadRequest } from "@omnlgy/common";

import { Order, OrderStatus } from "../models/order";
import { natsClient } from "../utils/NatsClient";
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher";

const router = Router({ mergeParams: true });

router.patch("/:orderId", isAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) throw new ErrorNotFound();
  if (order.id != req.params.orderId) throw new ErrorBadRequest("Unauthorized", 401);

  order.status = OrderStatus.Cancelled;

  await order.save();

  new OrderCancelledPublisher(natsClient.stan).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
    version:order.version
  });

  res.status(200).json({
    type: "oder",
    links: {
      self: "api/orders/" + req.params.orderId,
    },
    attributes: order,
  });
});

export { router as cancelRoutes };
