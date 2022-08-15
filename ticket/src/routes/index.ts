import { Router } from "express";
import { ticketRouter } from "./getTicket";
import { ticketsRouter } from "./getTickets";
import { newRoutes } from "./newTicket";

const router = Router({ mergeParams: true });
router.use(newRoutes);
router.use(ticketsRouter);
router.use(ticketRouter);

export default router;
