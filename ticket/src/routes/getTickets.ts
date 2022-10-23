import { Router, Request, Response } from "express";
import { isAuth } from "@omnlgy/common";
import { Ticket } from "../models/ticket";

const router = Router({ mergeParams: true });

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = Ticket.find();

  res.status(200).json({
    links: {
      self: "/api/tickets",
    },
    data: (await tickets).map((ticket) => {
      const id = ticket.id;
      return {
        type: "ticket",
        links: {
          self: "/api/tickets/" + id,
        },
        attributes: {
          id,
          ...ticket,
        },
      };
    }),
  });
});

export { router as ticketsRouter };
