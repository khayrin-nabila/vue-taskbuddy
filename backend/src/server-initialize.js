import app from './server.js';
import { connectToDatabase } from './database.js';
import { Router } from 'express';
import createUser from '../controller/signup.js';
import login from '../controller/login.js';
import tasksRoutes from '../routes/tasks.js';

export async function initializeServer() {
    const db = await connectToDatabase();
    const tasksCollection = db.collection('tasks');

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

    return app;
}
