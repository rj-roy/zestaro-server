import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DbConnect, disconnectDB } from './config/db.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("running");
});

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
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

const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    if (server) server.close();
    await disconnectDB();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();