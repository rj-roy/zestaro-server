import { MongoClient, ServerApiVersion, type Db, type Collection } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
});

interface Collections {
    menuCollection: Collection;
}

let db: Db | null = null;
let collections: Collections | null = null;
let connecting: Promise<{ db: Db; collections: Collections }> | null = null;

export const DbConnect = async (): Promise<{ db: Db; collections: Collections }> => {
    if (db && collections) return { db, collections };

    if (connecting) return connecting;

    connecting = (async () => {
        await client.connect();
        await client.db('admin').command({ ping: 1 });

        const dbName = process.env.DB_NAME;
        if (!dbName) throw new Error('DB_NAME environment variable is not set');

        db = client.db(dbName);

        const collectionName = process.env.MENU_COLLECTION;
        if (!collectionName) throw new Error('MENU_COLLECTION environment variable is not set');

        collections = {
            menuCollection: db.collection(collectionName),
        };

        console.log('DB Connected');
        return { db, collections };
    })();

    try {
        return await connecting;
    } finally {
        connecting = null;
    }
};

export const getCollections = (): Collections => {
    if (!collections) {
        throw new Error('Database not initialized — DbConnect() must run before any request is handled.');
    }
    return collections;
};

export const disconnectDB = async (): Promise<void> => {
    await client.close();
    db = null;
    collections = null;
    console.log('DB Disconnected');
};
