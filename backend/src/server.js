import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: [
      'https://brave-ground-0ce2cac00.4.azurestaticapps.net',
      'http://localhost:8000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
  // Use CORS middleware
app.use(cors(corsOptions));
app.use(cookieParser());

export default app;
