import { initializeServer } from './server-initialize.js';

const port = process.env.PORT || 8000;

try {
    initializeServer()
        .then((appInstance) => {
            appInstance.listen(port, () => {
                // eslint-disable-next-line no-console
                console.log(`Server is running on port ${port}...`);
            });
        })
} catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error starting the server:', error);
}