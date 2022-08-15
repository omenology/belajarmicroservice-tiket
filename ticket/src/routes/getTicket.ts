import { Router, Request, Response } from "express";
import { isAuth, ErrorNotFound } from "@omnlgy/common";
import { Ticket } from "../models/ticket";

const router = Router({ mergeParams: true });

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ErrorNotFound();
  res.status(200).json({
    type: "ticket",
    links: {
      self: "api/tickets/" + req.params.id,
    },
    attributes: ticket,
  });
});

export { router as ticketRouter };
