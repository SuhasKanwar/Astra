import { Router } from "express";
import { getHeadlinesHandler, searchNewsHandler } from "../controllers/newsController.ts";

const newsRouter = Router();

newsRouter.get("/headlines", getHeadlinesHandler);
newsRouter.get("/search", searchNewsHandler);

export default newsRouter;