import { Router } from "express";
import { searchNewsHandler } from "../controllers/newsController.ts";

const newsRouter = Router();

newsRouter.get("/search", searchNewsHandler);

export default newsRouter;