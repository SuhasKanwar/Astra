import { Router } from "express";
import { signInHandler, signOutHandler, signUpHandler } from "../controllers/authController.ts";

const authRouter = Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/signin", signInHandler);
authRouter.post("/signout", signOutHandler);

export default authRouter;