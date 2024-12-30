import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
    const client = new MongoClient(process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGODB_URI);
    await client.connect();
    return client.db('fsv-db');
}