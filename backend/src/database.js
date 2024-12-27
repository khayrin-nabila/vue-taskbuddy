import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    return client.db('fsv-db');
}