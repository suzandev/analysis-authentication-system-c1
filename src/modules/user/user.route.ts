import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);

export const userRoutes = router;
