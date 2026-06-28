import { Router } from "express";
import { createReportHandler, getReportsHandler } from "../controllers/reportsController.ts";

const reportsRouter = Router();

reportsRouter.post("/", createReportHandler);
reportsRouter.get("/", getReportsHandler);

export default reportsRouter;
