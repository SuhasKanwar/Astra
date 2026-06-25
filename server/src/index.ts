import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PORT } from './lib/config.js';
import logger from './middlewares/logger.js';
import authRouter from './routes/authRouter.js';

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

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server ->", err);
        process.exit(1);
    } else {
        console.log(`Server is running on port -> ${PORT}`);
    }
});