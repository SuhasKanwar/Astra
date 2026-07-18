import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PORT } from './lib/config.ts';
import logger from './middlewares/logger.ts';
import authRouter from './routes/authRouter.ts';
import newsRouter from './routes/newsRouter.ts';
import eventsRouter from './routes/eventsRouter.ts';
import authenticate from './middlewares/authenticate.ts';
import conversationRouter from './routes/conversationRouter.ts';

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Astra API",
    });
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Astra API is healthy and running successfully.",
    });
});

app.use("/api/auth", authRouter);
app.use("/api/news", authenticate, newsRouter);
app.use("/api/events", authenticate, eventsRouter);
app.use("/api/conversation", authenticate, conversationRouter);

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server ->", err);
        process.exit(1);
    } else {
        console.log(`Server is running on port -> ${PORT}`);
    }
});