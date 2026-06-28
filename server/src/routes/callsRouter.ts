import { Router } from "express";
import { lookupNumberHandler } from "../controllers/callsController.ts";

const callsRouter = Router();

callsRouter.get("/lookup", lookupNumberHandler);

export default callsRouter;
