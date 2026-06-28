import { Router } from "express";
import { getChecksHandler } from "../controllers/callsController.ts";

const checksRouter = Router();

checksRouter.get("/", getChecksHandler);

export default checksRouter;
