import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true
    },
    serverSelectionTimeoutMS: 5000,
});

let db = null;
let collections = null;
let connecting = null;

export const DbConnect = async () => {
    if (db) return { db, collections };

    if (connecting) return connecting;

    connecting = (async () => {
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        db = client.db(process.env.DB_NAME);

        collections = {
            menuCollection: db.collection(process.env.MENU_COLLECTION),
        };

        console.log("DB Connected");
        return { db, collections };
    })();

    try {
        return await connecting;
    } finally {
        connecting = null;
    };
};

export const getCollections = () => {
    if (!collections) {
        throw new Error('Database not initialized — connectDB() must run before any request is handled.');
    };
    return collections;
};

export const disconnectDB = async () => {
    await client.close();
    db = null;
    collections = null;
    console.log('DB Disconnected');
};