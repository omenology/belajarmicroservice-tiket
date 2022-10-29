import { Router } from "express";

import { newRoutes } from "./new";

const router = Router({ mergeParams: true });

router.use("/api/orders/", newRoutes);

export default router;
