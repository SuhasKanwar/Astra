import { Router } from "express";
import { getNaturalEventsHandler } from "../controllers/eonetController.ts";

const eventsRouter = Router();

eventsRouter.get("/natural", getNaturalEventsHandler);

export default eventsRouter;