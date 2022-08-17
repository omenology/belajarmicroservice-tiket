import { Router } from "express";
import { ticketRouter } from "./getTicket";
import { ticketsRouter } from "./getTickets";
import { newRoutes } from "./newTicket";
import { updateRoutes } from "./updateTicket";

const router = Router({ mergeParams: true });

router.use(newRoutes);
router.use(ticketsRouter);
router.use(ticketRouter);
router.use(updateRoutes);

export default router;
