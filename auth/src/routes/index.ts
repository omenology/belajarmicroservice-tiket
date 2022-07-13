import { Router } from "express";
import { userRoutes } from "./users";

const router = Router({ mergeParams: true });

router.use("/api/users/", userRoutes);

export default router;
