import { initializeServer } from './server-initialize.js';

const PORT = process.env.PORT || 8000;

try {
    initializeServer()
        .then((appInstance) => {
            appInstance.listen(PORT, () => {
                // eslint-disable-next-line no-console
                console.log(`Server is running on port ${PORT}...`);
            });
        })
} catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error starting the server:', error);
}