import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

export default app;
