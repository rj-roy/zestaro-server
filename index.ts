import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DbConnect, disconnectDB } from './config/db.js';
import rateLimit from 'express-rate-limit';
import menuRoutes from './routes/menu.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

const publicLimiter = rateLimit({ windowMs: 60_000, max: 60 });

app.use(express.json());

app.use('/api/v1/get/menu', publicLimiter, menuRoutes);

app.get('/', publicLimiter, (_req, res) => {
    res.send('running');
});

const PORT = process.env.PORT || 5000;
let server: ReturnType<typeof app.listen>;

const startServer = async (): Promise<void> => {
    try {
        await DbConnect();
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Failed to start Server', error);
        process.exit(1);
    }
};

const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down gracefully`);
    if (server) server.close();
    await disconnectDB();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
