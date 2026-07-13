import { Router } from "express";
import { getGeopoliticalEventsHandler, getNaturalEventsHandler } from "../controllers/eventsController.ts";

const eventsRouter = Router();

eventsRouter.get("/natural", getNaturalEventsHandler);
eventsRouter.get("/geopolitics", getGeopoliticalEventsHandler);

export default eventsRouter;