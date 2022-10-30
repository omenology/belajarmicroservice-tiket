import { Router, Request, Response } from "express";
import { isAuth, ErrorNotFound, ErrorBadRequest } from "@omnlgy/common";

import { Order } from "../models/order";

const router = Router({ mergeParams: true });

router.get("/", isAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.decoded!.id,
  }).populate("ticket");

  res.status(200).json({
    links: {
      self: "/api/orders",
    },
    data: (await orders).map((order) => {
      return {
        type: "order",
        links: {
          self: "/api/orders/" + order.id,
        },
        attributes: order,
      };
    }),
  });
});

router.get("/:orderId", isAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) throw new ErrorNotFound();
  if (order.userId != req.decoded!.id) throw new ErrorBadRequest("Unauthorized", 401);

  res.status(200).json({
    type: "oder",
    links: {
      self: "api/orders/" + req.params.id,
    },
    attributes: order,
  });
});

export { router as getRoutes };
