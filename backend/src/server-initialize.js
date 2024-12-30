import app from './server.js';
import { connectToDatabase } from './database.js';
import { Router } from 'express';
import createUser from '../controller/signup.js';
import login from '../controller/login.js';
import tasksRoutes from '../routes/tasks.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

export async function initializeServer() {
    const db = await connectToDatabase();
    const tasksCollection = db.collection('tasks');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const router = Router();

    // Define Routes
    router.post('/api/signup', createUser(db));
    router.post('/api/login', login(db));
    router.get('/api/logout', (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out' });
    });

    app.use(router);
    app.use('/api/tasks', tasksRoutes(tasksCollection));

    // Serve frontend static assets
    app.use(express.static(path.join(__dirname, 'frontend')));

    // Fallback route to serve frontend index.html for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    });

    return app;
}
