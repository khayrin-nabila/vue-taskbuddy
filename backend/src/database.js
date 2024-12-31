import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
    const client = new MongoClient(process.env.ATLAS_URI || process.env.MONGO_URI, {
        ssl: true,
      });
    await client.connect();
    return client.db('fsv-db');
}