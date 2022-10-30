import { Router, Request, Response } from "express";
import { isAuth, ErrorNotFound, ErrorBadRequest } from "@omnlgy/common";

import { Order, OrderStatus } from "../models/order";

const router = Router({ mergeParams: true });

router.patch("/:orderId", isAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) throw new ErrorNotFound();
  if (order.id != req.params.orderId) throw new ErrorBadRequest("Unauthorized", 401);

  order.status = OrderStatus.Cancelled
  
  await order.save()

  res.status(200).json({
    type: "oder",
    links: {
      self: "api/orders/" + req.params.id,
    },
    attributes: order,
  });
});

export { router as cancelRoutes };