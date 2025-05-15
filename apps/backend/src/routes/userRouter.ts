import { Router } from "express";
import userController from "@/controllers/userController";
import authMiddleware from "@/middlewares/authMiddleware";

const userRouter: Router = Router();

userRouter.get("/self", userController.self);
userRouter.get("/health", userController.health);
userRouter.get("/get-nonce", userController.getNonce);
userRouter.get("/auth-check", authMiddleware, userController.authCheck);

export default userRouter;
