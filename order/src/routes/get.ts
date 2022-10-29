import { Router, Request, Response } from "express";
import { isAuth } from "@omnlgy/common";

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

export { router as getRoutes };
