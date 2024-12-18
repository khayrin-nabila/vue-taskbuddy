import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth';
import { Router } from "express";
import createUser from "../controller/signup";
import login from "../controller/login";
import authMiddleware from "../middleware/middleware";

dotenv.config();

async function start() {
    const url = process.env.MONGO_URI; // Use environment variable
    const client = new MongoClient(url);
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use((req, res, next) => {
        // Set CORS headers
        res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Replace with your frontend domain
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, etc.)

        // Pass to next layer of middleware
        next();
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('fsv-db');
        const tasksCollection = db.collection('tasks');
        const router = Router();
        app.use(router);
        router.post("/api/signup", createUser(db));
        router.post("/api/login", login(db));
        router.get("/api/logout", (req, res) => {
            res.clearCookie("token");
            res.json({ message: "Logged out" });
          });
        // Routes
        // app.get('/api/tasks/:id', async (req, res) => {
        //     const taskId = req.params.id;
        //     const task = await tasksCollection.findOne({ id: taskId });
        //     task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
        // });

        app.get('/api/tasks', authMiddleware, async (req, res) => {
            const tasks = await tasksCollection.find({ userId: req.user.id }).toArray();
            res.json(tasks);
        });

        app.post('/api/tasks', authMiddleware, async (req, res) => {
            const newTask = {
                ...req.body,
                id: uuidv4(),
                userId: req.user.id,
                isCompleted: req.body.isCompleted || false,
                isEditing: req.body.isEditing || false,
            };
            try {
                const result = await tasksCollection.insertOne(newTask);
                const insertedTask = await tasksCollection.findOne({ _id: result.insertedId });
                res.status(201).json(insertedTask);
            } catch (error) {
                console.error("Error inserting task:", error);
                res.status(500).json({ error: "Failed to add task" });
            }
        });

        app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
            const taskId = req.params.id;
            const { _id, ...updatedTask } = req.body;

            try {
                const result = await tasksCollection.findOneAndUpdate(
                    { id: taskId },
                    { $set: updatedTask },
                    { returnDocument: 'after' }
                );
                result
                    ? res.json(result)
                    : res.status(404).json({ message: 'Task not found' });
            } catch (error) {
                console.error("Error updating task:", error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });

        app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
            const taskId = req.params.id;
            const result = await tasksCollection.deleteOne({ id: taskId });

            result.deletedCount > 0
                ? res.json({ message: 'Task deleted successfully' })
                : res.status(404).json({ message: 'Task not found' });
        });

        app.delete('/api/tasks', async (req, res) => {
            try {
                const result = await tasksCollection.deleteMany({});
                res.json({ message: 'All tasks deleted', deletedCount: result.deletedCount });
            } catch (error) {
                console.error('Error clearing tasks:', error);
                res.status(500).json({ message: 'Failed to delete tasks' });
            }
        });

        // JWT Authentication Routes
        // const authRoutes = require('../routes/auth');
        // app.use('/api/auth', authRoutes);

        // Start Server
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

start();
