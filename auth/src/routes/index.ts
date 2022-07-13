import { Router } from "express";
import { signupRouter } from "./signup";
import {signinRouter} from './signin'

const router = Router({mergeParams: true});

router.use("/api/users/signup", signupRouter);
router.use("/api/users/signin", signinRouter);

export default router;