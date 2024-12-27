import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from '../middleware/middleware.js';

const tasksRouter = Router();

export default function tasksRoutes(tasksCollection) {
    // Fetch all tasks for the authenticated user
    tasksRouter.get('/', authMiddleware, async (req, res) => {
        const tasks = await tasksCollection.find({ userId: req.user.id }).toArray();
        res.json(tasks);
    });

    // Add a new task
    tasksRouter.post('/', authMiddleware, async (req, res) => {
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
            res.status(500).json({ error: "Failed to add task" });
        }
    });

    // Update a task by ID
    tasksRouter.put('/:id', authMiddleware, async (req, res) => {
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
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // Delete a task by ID
    tasksRouter.delete('/:id', authMiddleware, async (req, res) => {
        const taskId = req.params.id;
        const result = await tasksCollection.deleteOne({ id: taskId });

        result.deletedCount > 0
            ? res.json({ message: 'Task deleted successfully' })
            : res.status(404).json({ message: 'Task not found' });
    });

    // Delete all tasks
    tasksRouter.delete('/', async (req, res) => {
        try {
            const result = await tasksCollection.deleteMany({});
            res.json({ message: 'All tasks deleted', deletedCount: result.deletedCount });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete tasks' });
        }
    });

    return tasksRouter;
}
