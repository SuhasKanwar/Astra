import express, { type Request, type Response } from 'express';
import { PORT } from './lib/config.js';

const app = express();

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

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server ->", err);
        process.exit(1);
    } else {
        console.log(`Server is running on port -> ${PORT}`);
    }
});