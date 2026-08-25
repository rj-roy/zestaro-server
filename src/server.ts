import app from "./app.js";
import { DbConnect, disconnectDB } from "./config/db.js";

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