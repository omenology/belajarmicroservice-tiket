import { Router } from "express";

import { newRoutes } from "./new";
import { getRoutes } from "./get";
import { cancelRoutes } from "./cancel";

const router = Router({ mergeParams: true });

router.use("/api/orders/", newRoutes);
router.use("/api/orders/", getRoutes);
router.use("/api/orders/", cancelRoutes);

export default router;
